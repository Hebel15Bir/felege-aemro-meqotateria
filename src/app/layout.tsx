import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'ፈለገ አእምሮ ጉባኤ ቤት',
	description:
		'ይህ በመካነ ሰማዕት ቅዱስ ቂርቆስ ቤተ ክርስቲያን የፈለገ አእምሮ ጉባኤ ቤት መመዝገቢያና መቆጣጠሪያ ገጽ ነው።',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='am'>
			<body className='antialiased'>{children}</body>
		</html>
	);
}
