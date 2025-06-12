'use client';

import { useState, useEffect } from 'react';
import { RegistrationIDDocument } from './PDFDocument';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import VerifyOne from './VerifyOne';
import { confirmPrint } from '../server/actions';
import SpinBall from './SpinBall';

export default function VerifyDetails() {
	const [isLoading, setIsLoading] = useState(false);
	const [print, setPrint] = useState(false);
	const [toBePrinted, setToBePrinted] = useState([]);
	const [count, setCount] = useState(0);

	useEffect(() => {
		const getNumber = async () => {
			const response = await fetch(`/verify/studentsId`);
			const students = await response.json();
			if (students.length === 9) {
				setPrint(true);
				setToBePrinted(students);
			}
		};

		getNumber();
	}, [count]);

	const [query, setQuery] = useState('');
	const [result, setResult] = useState([]);
	const [error, setError] = useState('');

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`/verify/${query}`);
			const students = await response.json();
			if (students.length === 0) {
				throw new Error();
			}
			setError('');
			setResult(students);
			setQuery('');
		} catch (err) {
			console.log(err);
			setError('የተሳሳተ የደረሰኝ ቍጥር አስገብተዋል።');
			setResult([]);
		}
		setIsLoading(false);
	};

	const handleRegister = (id) => {
		setCount(count + 1);
		setResult((prev) => prev.filter((student) => student._id !== id));
	};

	const handleDownload = async () => {
		setIsLoading(true);
		try {
			const blob = await pdf(
				<RegistrationIDDocument students={toBePrinted} />
			).toBlob();
			await confirmPrint(toBePrinted);
			setToBePrinted([]);
			setPrint(false);
			setCount(0);
			saveAs(blob, 'የተማሪዎች_መታወቂያ.pdf');
		} catch (error) {
			console.log('Error generating PDF:', error);
			setError('የተማሪዎች መታወቂያ አልወረደም። እንደገና ያውርዱ።');
			// setCount(9);
		}
		setIsLoading(false);
	};

	return (
		<div className='w-md max-w-screen mx-auto shadow-lg rounded p-6'>
			{isLoading && <SpinBall />}
			<h2 className='text-2xl font-black text-center mb-4'>የምዝገባ ማረጋገጫ ቅጽ</h2>
			<div className='flex w-full justify-center items-center mb-3'>
				<input
					type='search'
					placeholder='የደረሰኝ ቍጥር ያስገቡ።'
					name='paymentId'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className='p-2 border w-full border-gray-300 rounded text-black focus:border-blue-500 outline-none rounded-r-none'
				/>
				<button
					type='button'
					onClick={handleSearch}
					className='p-2 bg-blue-500 text-white rounded rounded-l-none'
				>
					ፈልግ
				</button>
			</div>
			{error && (
				<div className='bg-red-500 p-2 text-white rounded'>{error}</div>
			)}
			{result.length !== 0 && (
				<>
					<div className='text-xl mb-2'>የትምህርት ዝርዝር ያረጋግጡ።</div>

					{result.map((student, index) => {
						return (
							<VerifyOne
								key={index}
								student={student}
								onRegister={handleRegister}
							/>
						);
					})}
				</>
			)}
			{print && (
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
