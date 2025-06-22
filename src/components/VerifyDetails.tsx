'use client';

import { useState, useEffect } from 'react';
import TextInput from './TextInput';
import SpinBall from './SpinBall';
import {
	confirmPrinted,
	getStudents,
	getUnverified,
	getToBePrinted,
} from '@/server/actions';
import { classes } from '@/util/consts';
import VerifyOne from './VerifyOne';
import { IDDetailProps, VerifiedDetails } from '@/util/types';
import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from './PDFDocument';
import { saveAs } from 'file-saver';

export default function VerifyDetails() {
	const [isLoading, setIsLoading] = useState(false);
	const [isPrintable, setIsPrintable] = useState(false);
	const [toBePrinted, setToBePrinted] = useState<IDDetailProps[]>([]);
	const [count, setCount] = useState(0);

	const [query, setQuery] = useState('');
	const [result, setResult] = useState<VerifiedDetails[]>([]);
	const [error, setError] = useState('');
	const [studentNumber, setStudentNumber] = useState([
		{ classroom: 'ንባብ-1', amount: 0 },
		{ classroom: 'ንባብ-2', amount: 0 },
		{ classroom: 'ንባብ-3', amount: 0 },
		{ classroom: 'ዜማ', amount: 0 },
		{ classroom: 'ቅዳሴ', amount: 0 },
		{ classroom: 'ቅኔ', amount: 0 },
		{ classroom: 'አቋቋም', amount: 0 },
		{ classroom: 'ትርጓሜ', amount: 0 },
	]);

	useEffect(() => {
		const rerenderPage = async () => {
			const students = await getToBePrinted();
			if (students.length === 9) {
				setIsPrintable(true);
				setToBePrinted(students);
			}
			const newStat = [];
			for (const classroom of classes) {
				const amount = await getStudents('new', classroom);
				newStat.push({ classroom, amount: amount.newOnes });
			}
			setStudentNumber(newStat);
		};

		rerenderPage();
	}, [count]);

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			const students = await getUnverified(query);
			if (students.length === 0) {
				throw new Error();
			}
			setError('');
			setQuery('');
			setResult(students);
		} catch (err) {
			console.log(err);
			setError('የተሳሳተ የደረሰኝ ቍጥር አስገብተዋል።');
			setResult([]);
		}
		setIsLoading(false);
	};

	const handleRegister = (id: string) => {
		setCount(count + 1);
		setResult((prev) => prev.filter((student) => student.id !== id));
	};

	const handleDownload = async () => {
		setIsLoading(true);
		try {
			const blob = await pdf(<PDFDocument students={toBePrinted} />).toBlob();
			await confirmPrinted(toBePrinted);
			setToBePrinted([]);
			setIsPrintable(false);
			saveAs(blob, 'የተማሪዎች_መታወቂያ.pdf');
			setCount(count + 1);
		} catch (error) {
			console.log('Error generating PDF:', error);
			setError('የተማሪዎች መታወቂያ አልወረደም። እንደገና ያውርዱ።');
			setCount(count + 1);
		}
		setIsLoading(false);
	};

	return (
		<div className='w-md max-w-screen mx-auto shadow-lg rounded p-6'>
			{isLoading && <SpinBall />}
			<h2 className='text-2xl font-black text-center'>የዐዲስ ተማሪዎች ብዛት</h2>
			<div className='grid grid-cols-2 gap-4 max-w-3xl mx-auto p-4 mb-4'>
				{studentNumber.map((classObj, index) => (
					<div
						key={index}
						className='bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300'
					>
						<span className='text-lg font-semibold mb-2'>
							{classObj.classroom} :{' '}
							<span className='text-gray-600'>{classObj.amount}</span>
						</span>
					</div>
				))}
			</div>
			<h2 className='text-2xl font-black text-center mb-4'>የምዝገባ ማረጋገጫ ቅጽ</h2>
			<div className='flex w-full justify-center items-center'>
				<TextInput
					name='paymentId'
					placeholder='የደረሰኝ ቍጥር ያስገቡ።'
					value={query}
					handleChange={(newVal) => setQuery(newVal)}
				/>
				<button
					type='button'
					onClick={handleSearch}
					className='p-2 bg-blue-500 text-white rounded rounded-l-none mb-2.5'
				>
					ፈልግ
				</button>
			</div>
			{error && (
				<div className='bg-red-500 p-2 text-white rounded mb-2.5'>{error}</div>
			)}
			{result.length !== 0 && (
				<>
					<div className='text-xl mb-2'>የትምህርት ዝርዝር ያረጋግጡ።</div>

					{result.map((student) => {
						return (
							<VerifyOne
								key={student.id}
								student={student}
								onRegister={handleRegister}
							/>
						);
					})}
				</>
			)}
			{isPrintable && (
				<button
					className='w-full p-2 bg-green-500 text-white rounded-md'
					onClick={handleDownload}
				>
					መታወቂያውን ያውርዱ
				</button>
			)}
		</div>
	);
}
