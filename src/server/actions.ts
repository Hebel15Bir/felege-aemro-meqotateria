'use server';

import { IDDetailProps, Stats, VerifiedDetails } from '@/util/types';
import { connectToDatabase } from './db';
import { Registrant } from './model';
import { classes } from '@/util/consts';

export async function getStudents(
	type: 'new' | 'all',
	classroom: string
): Promise<Stats> {
	await connectToDatabase();
	const filterDataAll = {
		confirmStatus: { $in: ['verified', 'printed'] },
		'classDetails.classroom': classroom,
	};
	const filterDataNew = {
		...filterDataAll,
		isNewStudent: true,
	};
	const newOnes = await Registrant.countDocuments(filterDataNew);
	if (type === 'all') {
		const total = await Registrant.countDocuments(filterDataAll);
		const oldOnes = total - newOnes;
		return { total, newOnes, oldOnes };
	}
	return { newOnes };
}

export async function getUnverified(
	paymentId: string
): Promise<VerifiedDetails[]> {
	await connectToDatabase();
	const students = await Registrant.find({
		paymentId,
		confirmStatus: 'registered',
	}).lean();

	return students.map((student) => {
		return {
			id: student._id.toString(),
			fullName: student.fullName,
			isNewStudent: student.isNewStudent,
			classDetails: student.classDetails,
		};
	});
}

export async function verifyStudent(
	student: VerifiedDetails,
	isNew: boolean,
	name: string
) {
	await connectToDatabase();

	const total = await Registrant.countDocuments({
		confirmStatus: { $in: ['verified', 'printed'] },
	});

	const inClass = await Registrant.countDocuments({
		confirmStatus: { $in: ['verified', 'printed'] },
		'classDetails.classroom': student.classDetails.classroom,
	});

	const uniqueId = `${total + 1}/${inClass + 1}`;

	const updateData = {
		fullName: name,
		uniqueId: uniqueId,
		verifiedDate: new Date(),
		confirmStatus: 'verified',
		isNewStudent: isNew,
		classDetails: student.classDetails
	};

	await Registrant.findByIdAndUpdate(student.id, updateData, {
		new: true,
		runValidators: true,
	}).exec();
}

export async function getToBePrinted(): Promise<IDDetailProps[]> {
	await connectToDatabase();
	const students = await Registrant.find({
		confirmStatus: 'verified',
	})
		.limit(9)
		.lean();

	if (students.length !== 9) {
		return [];
	}

	return students.map((student) => {
		return {
			fullName: student.fullName,
			imageUrl: student.imageUrl,
			phoneNo: student.phoneNo,
			classroom: student.classDetails.classroom,
			subject: student.classDetails.subject,
			uniqueId: student.uniqueId,
		};
	});
}

export async function confirmPrinted(students: IDDetailProps[]) {
	await connectToDatabase();
	for (const student of students) {
		await Registrant.findOneAndUpdate(
			{ uniqueId: student.uniqueId },
			{
				confirmStatus: 'printed',
			},
			{
				new: true,
				runValidators: true,
			}
		).exec();
	}
}

export async function getAttendance() {
	const times = ['የማታ', 'የሌሊት', 'የጠዋት'];
	const studentData = [];
	await connectToDatabase();
	for (const clsrm of classes) {
		for (const tm of times) {
			const classData = await Registrant.find({
				confirmStatus: { $in: ['verified', 'printed'] },
				'classDetails.classroom': clsrm,
				'classDetails.classTime': tm,
			});

			const students = classData.map((student) => {
				return {
					name: student.fullName,
					age: student.age,
					phoneNo: student.phoneNo,
					paymentId: student.paymentId,
					uniqueId: student.uniqueId,
				};
			});

			if (students.length !== 0) {
				studentData.push({
					name: `${clsrm} ${tm}`,
					data: students,
				});
			}
		}
	}
	return studentData;
}
