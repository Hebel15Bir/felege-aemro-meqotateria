import Downloader from '@/components/Downloader';
import StudentsList from '@/components/StudentsList';
import { classes } from '@/util/consts';

export default function Home() {
	return (
		<div className='flex flex-col justify-center items-center max-w-3xl mx-auto'>
			<div className='grid grid-cols-4 gap-4 max-w-3xl mx-auto p-4'>
				{classes.map((classroom, index) => (
					<StudentsList classroom={classroom} key={index} />
				))}
			</div>
			<Downloader />
		</div>
	);
}
