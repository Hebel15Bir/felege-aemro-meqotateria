'use client';

import { getAttendance } from '@/server/actions';
import { saveAs } from 'file-saver';
import { useState } from 'react';

export default function Downloader() {
	const [errors, setErrors] = useState<string[]>([]);
	const handleDownload = async () => {
		setErrors([]);
		const attendance = await getAttendance();
		for (const classroom of attendance) {
			const data = classroom.data;
			if (data.length === 0) {
				setErrors([...errors, `የ${classroom.classroom}ን ተማሪዎች ማግኘት አልተቻለም።`]);
				return;
			}

			const headers = ['ቍጥር', 'ሙሉ ስም', 'ዕድሜ', 'ደረሰኝ ቍጥር', 'ስልክ ቍጥር'];
			const dataHeaders = Object.keys(data[0]);

			const csvRows = [
				headers.join(','),
				...data.map((row, index) =>
					[
						`${index + 1}`,
						...dataHeaders.map((field) => {
							const value = row[field as keyof typeof row];
							return value;
						}),
					].join(',')
				),
			];

			const csvString = csvRows.join('\n');

			const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
			saveAs(blob, `የ${classroom.classroom} ተማሪዎች ዝርዝር.csv`);
		}
	};

	return (
		<>
			<button
				className='w-full p-2 bg-green-500 text-white rounded-md max-w-sm'
				onClick={handleDownload}
			>
				የተማሪዎችን ዝርዝር ያውርዱ
			</button>
			{errors.map((error) => {
				<div className='bg-red-500 p-2 text-white rounded mb-2.5'>{error}</div>;
			})}
		</>
	);
}
