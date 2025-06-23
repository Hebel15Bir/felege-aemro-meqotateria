import { verifyStudent } from '@/server/actions';
import { FormEvent, useState, useReducer } from 'react';
import SpinBall from './SpinBall';
import { ClassInfo, ReducerAction, VerifyOneProps } from '@/util/types';
import DropDown from './DropDown';
import { validateFormData } from '@/util';
import { classes, errorMsgs } from '@/util/consts';
import CheckBox from './CheckBox';
import TextInput from './TextInput';

const reducer = (state: ClassInfo, action: ReducerAction) => {
	switch (action.type) {
		case 'update field':
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};

export default function VerifyOne({ student, onRegister }: VerifyOneProps) {
	const [state, dispatch] = useReducer(reducer, student.classDetails);
	const [isNew, setIsNew] = useState(student.isNewStudent);
	const [name, setName] = useState(student.fullName);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleEdit = async (e: FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const missing = validateFormData(
			state as unknown as Record<string, string>,
			errorMsgs
		);
		if (missing) {
			setError(missing);
			return;
		}
		setIsLoading(true);

		const newStudent = {
			...student,
			classDetails: state,
		};
		try {
			await verifyStudent(newStudent, isNew, name);
			onRegister(student.id);
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
				<div className='bg-red-500 p-2 text-white rounded mb-2.5'>{error}</div>
			)}
			<TextInput
				name='fullName'
				placeholder='ሙሉ ስም'
				value={name}
				handleChange={(newVal) => setName(newVal)}
			/>
			<div>
				<CheckBox
					name='isNewStudent'
					placeholder='ዐዲስ ተማሪ ናቸው?'
					value={isNew}
					handleChange={() => {
						setIsNew(!isNew);
					}}
				/>
				<DropDown
					name='classroom'
					value={state.classroom}
					placeholder='የሚማሩበት ክፍል'
					items={classes}
					handleChange={(newVal) => {
						dispatch({
							type: 'update field',
							payload: { classroom: newVal },
						});
						dispatch({
							type: 'update field',
							payload: { subject: '' },
						});
					}}
				/>
				<DropDown
					name='subject'
					value={state.subject}
					placeholder='የሚማሩት ትምህርት'
					items={[state.classroom, 'ንባብ', 'ዜማ'].filter((cls, index) => {
						if (cls === 'ዜማ') {
							if (index === 0) {
								return true;
							}
							return ['ንባብ-3', 'አቋቋም', 'ቅዳሴ'].includes(state.classroom);
						} else if (cls === 'ንባብ') {
							return !['ቅኔ', 'ትርጓሜ'].includes(state.classroom);
						} else {
							return !cls.includes('ንባብ-');
						}
					})}
					handleChange={(newVal) => {
						dispatch({
							type: 'update field',
							payload: { subject: newVal },
						});
					}}
				/>
				<DropDown
					name='classTime'
					placeholder='የሚማሩበት ጊዜ'
					value={state.classTime}
					items={['የሌሊት', 'የጠዋት', 'የማታ']}
					handleChange={(newVal) => {
						dispatch({
							type: 'update field',
							payload: { classTime: newVal },
						});
					}}
				/>
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
