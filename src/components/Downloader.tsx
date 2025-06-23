'use client';

import { getAttendance } from '@/server/actions';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import ExcelJs from 'exceljs';

export default function Downloader() {
	const [errors, setErrors] = useState<string[]>([]);
	const handleDownload = async () => {
		setErrors([]);
		const attendance = await getAttendance();
		const workbook = new ExcelJs.Workbook();
		for (const classroom of attendance) {
			const data = classroom.data;
			if (data.length === 0) {
				setErrors([...errors, `የ${classroom.name}ን ተማሪዎች ማግኘት አልተቻለም።`]);
				continue;
			}
			const sheet = workbook.addWorksheet(classroom.name);
			sheet.columns = [
				{ header: 'ሙሉ ስም', key: 'name', width: 30 },
				{ header: 'መለያ ቍጥር', key: 'uniqueId', width: 10 },
				{ header: 'ዕድሜ', key: 'age', width: 8 },
				{ header: 'ስልክ ቍጥር', key: 'phoneNo', width: 20 },
				{ header: 'ደረሰኝ ቍጥር', key: 'paymentId', width: 15 },
			];

			for (const student of data) {
				sheet.addRow(student);
			}
		}
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		});
		saveAs(blob, `የተማሪዎች ዝርዝር.xlsx`);
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
