'use server';

import { v2 as cloudinary } from 'cloudinary';
import { connectToDatabase, disconnectDatabase } from './db';
import { Registrant } from './models';
import { todayEthCalendar } from '../other/util';
import fs from 'fs/promises';

cloudinary.config({
	cloud_name: 'dxmwtld0d',
	api_key: '143241854443167',
	api_secret: 'E0PKUYkmSHhaQqHfPKi-YMUfw0o',
});

export async function registerStudent(studentData) {
	const file = studentData.get('file');
	if (!file) {
		return {
			success: '',
			error: 'እባክዎ የተማሪ ምስል ያስገቡ።',
		};
	}
	if (!file.size) {
		return {
			success: '',
			error: 'እባክዎ የተማሪ ምስል ያስገቡ።',
		};
	}

	let photoUrl;

	try {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		photoUrl = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({}, (error, result) => {
					if (error) reject(error);
					else resolve(result.secure_url);
				})
				.end(buffer);
		});
	} catch {
		return {
			success: '',
			error: 'ምስሉ በአግባቡ አልተጫነም። እባክዎ እንደገና ይሞክሩ።',
		};
	}

	await connectToDatabase();
	const registrant = new Registrant({
		fullName: studentData.get('fullName'),
		kName: studentData.get('kName'),
		age: parseInt(studentData.get('age')),
		photoUrl: photoUrl,
		sex: studentData.get('sex'),
		phoneNo: studentData.get('phoneNo'),
		isOwn: studentData.get('isOwn') === 'on',
		ownerName: studentData.get('ownerName'),
		priesthood: studentData.get('priesthood'),
		isNewStudent: studentData.get('isNewStudent') === 'on',
		registryDate:
			studentData.get('isNewStudent') === 'on'
				? todayEthCalendar()
				: {
						year: parseInt(studentData.get('year')),
						month: studentData.get('month'),
						date: parseInt(studentData.get('date')),
				  },
		classDetails: {
			classroom: studentData.get('classroom'),
			subject: studentData.get('subject'),
			classTime: studentData.get('classTime'),
		},
		confirmStatus: 'registered',
		paymentId: studentData.get('paymentId'),
	});

	try {
		await registrant.save();
	} catch (err) {
		let error;
		console.log(err.name);
		if (isNaN(parseInt(studentData.get('age')))) {
			error = 'እባክዎ ዕድሜዎን ያስገቡ።';
		} else if (err.name === 'ValidationError') {
			error = err.errors[Object.keys(err.errors)[0]].message;
		} else {
			error = 'እባክዎ አስፈላጊዎቹን መረጃዎች በሙሉ ይሙሉ።';
		}
		return {
			success: '',
			error: error,
		};
	}

	await disconnectDatabase();

	return {
		success:
			'ምዝገባዎ በአግባቡ ተጠናቋል። የክፍያ ደረሰኝ በመያዝ ወደ ጉባኤ ቤቱ ጽሕፈት ቤት ሔደው ምዝገባዎን ያረጋግጡ።',
		error: '',
	};
}

export async function verifyStudent(studentData) {
	await connectToDatabase();

	const classroom = studentData.get('classroom');
	const subject = studentData.get('subject');
	const classTime = studentData.get('classTime');

	const fullName = studentData.get('fullName');
	const photoUrl = studentData.get('photoUrl');
	const studentId = studentData.get('studentId');

	const all = await Registrant.find({ _id: { $lt: studentId } });
	const total = all.length + 1;

	const some = await Registrant.find({
		'classDetails.classroom': classroom,
		_id: { $lt: studentId },
	});
	const inClass = some.length + 1;

	const uniqueId = `${total}/${inClass}`;

	if (!classroom) {
		return {
			error: 'እባክዎ የተማሪውን ክፍል ይሙሉ።',
		};
	}

	if (!subject) {
		return {
			error: 'እባክዎ የተማሪውን ትምህርት ይሙሉ።',
		};
	}

	if (!classTime) {
		return {
			error: 'እባክዎ የተማሪውን የትምህርት ሰዓት ይሙሉ።',
		};
	}

	try {
		const imageBuffer = await fetch(photoUrl).then((res) => res.arrayBuffer());
		const filePath = `./public/students/${fullName.replace('/', '_')}.jpg`;
		await fs.writeFile(filePath, Buffer.from(imageBuffer));
	} catch (err) {
		console.log(err);
		return {
			error: 'የተማሪው ምስል ወደ ኮምፒዩተርዎት አልወረደም። እባክዎ በድጋሚ ይሞክሩ።',
		};
	}

	const updateData = {
		uniqueId: uniqueId,
		confirmStatus: 'verified',
		'classDetails.classroom': classroom,
		'classDetails.classTime': classTime,
		'classDetails.subject': subject,
	};

	await Registrant.findByIdAndUpdate(studentId, updateData, {
		new: true,
		runValidators: true,
	}).exec();

	await disconnectDatabase();

	return {
		error: '',
	};
}

export const getStudentsToPrint = async () => {
	try {
		await connectToDatabase();
		const students = await Registrant.find({
			confirmStatus: 'verified',
		}).limit(9);
		await disconnectDatabase();
		return students;
	} catch (error) {
		console.log(error);
	}
};

export const confirmPrint = async (students) => {
	try {
		await connectToDatabase();
		for (let student of students) {
			await Registrant.findByIdAndUpdate(
				student._id,
				{
					confirmStatus: 'printed',
				},
				{
					new: true,
					runValidators: true,
				}
			).exec();
		}
		await disconnectDatabase();
	} catch (err) {
		console.log(err);
	}
};
