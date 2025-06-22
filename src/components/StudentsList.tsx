import { getStudents } from '@/server/actions';
import { Stats, StudentsListProps } from '@/util/types';

export default async function StudentsList({ classroom }: StudentsListProps) {
	const amount: Stats = await getStudents('all', classroom);
	return (
		<div className='bg-gray-100 p-6 rounded-lg shadow-md max-w-md'>
			<h3 className='text-xl text-center font-semibold text-gray-800 mb-4'>
				{classroom}
			</h3>
			<ul className='space-y-2'>
				<li className='bg-white p-4 rounded-md border border-gray-200'>
					<div className='text-gray-700'>
						<span className='block mb-1'>
							<span className='font-medium text-gray-800'>አጠቃላይ፡</span>{' '}
							{amount.total}
						</span>
						<span className='block mb-1'>
							<span className='font-medium text-gray-800'>ነባር፡</span>{' '}
							{amount.oldOnes}
						</span>
						<span className='block'>
							<span className='font-medium text-gray-800'>ዐዲስ፡</span>{' '}
							{amount.newOnes}
						</span>
					</div>
				</li>
			</ul>
		</div>
	);
}
