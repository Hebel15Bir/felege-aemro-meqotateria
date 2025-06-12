'use client';

import { verifyStudent } from '../server/actions';
import { useState } from 'react';
import SpinBall from './SpinBall';

export default function VerifyOne({ student, onRegister }) {
	const clsrm =
		student.classDetails.classroom &&
		!student.classDetails.classroom.startsWith('ንባብ')
			? student.classDetails.classroom
			: '';

	const [isLoading, setIsLoading] = useState(false);
	const [cls, setCls] = useState(clsrm);
	const [error, setError] = useState('');

	const [classroom, setClassroom] = useState(student.classDetails.classroom);
	const [subject, setSubject] = useState(student.classDetails.subject);
	const [classTime, setClassTime] = useState(student.classDetails.classTime);

	const handleEdit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const studentData = new FormData(
			document.getElementById('form-for-verify')
		);
		studentData.append('studentId', student._id);
		studentData.append('fullName', student.fullName);
		studentData.append('photoUrl', student.photoUrl);

		try {
			const outcome = await verifyStudent(studentData);
			setError(outcome.error);
			if (!outcome.error) {
				onRegister(student._id);
			}
		} catch (err) {
			console.log(err);
			setError('እባክዎ እንደገና ይሞክሩ');
		}
		setIsLoading(false);
	};

	return (
		<form id='form-for-verify'>
			{isLoading && <SpinBall />}
			{error && (
				<div className='bg-red-500 p-2 text-white rounded'>{error}</div>
			)}
			<div className='text-lg mb-2'>{student.fullName}</div>
			<div>
				<select
					name='classroom'
					id='classroom'
					defaultValue={classroom}
					className='w-full flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
					onChange={(e) => {
						setCls(e.target.value.startsWith('ንባብ') ? '' : e.target.value);
						setClassroom(e.target.value);
					}}
				>
					<option value=''>የትምህርት ክፍል</option>
					{['ንባብ-1', 'ንባብ-2', 'ንባብ-3', 'ዜማ', 'ቅኔ', 'ቅዳሴ', 'አቋቋም', 'ትርጓሜ'].map(
						(room) => (
							<option key={room} value={room}>
								{room}
							</option>
						)
					)}
				</select>
				<select
					name='subject'
					id='subject'
					defaultValue={subject}
					onChange={(e) => setSubject(e.target.value)}
					className='w-full flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
				>
					<option value=''>የሚማሩት ትምህርት</option>
					<option value='ንባብ'>ንባብ</option>
					{cls && <option value={cls}>{cls}</option>}
				</select>
				<select
					name='classTime'
					id='classTime'
					defaultValue={classTime}
					onChange={(e) => setClassTime(e.target.value)}
					className='w-full flex-auto p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2.5'
				>
					<option key='' value=''>
						የሚማሩበት ጊዜ
					</option>
					{['የሌሊት', 'የጠዋት', 'የማታ'].map((time) => (
						<option key={time} value={time}>
							{time}
						</option>
					))}
				</select>
			</div>
			<button
				type='submit'
				onClick={handleEdit}
				className='w-full p-2 bg-blue-500 text-white rounded-md mb-2.5'
			>
				ያጽድቁ
			</button>
			<hr className='mb-2.5' />
		</form>
	);
}
