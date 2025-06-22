import { Document, Types } from 'mongoose';

export type ErrorTypes<T> = {
	[K in keyof T]: string;
};

export interface DateInfo {
	date: number;
	month: string;
	year: number;
}

export interface ClassInfo {
	classroom: string;
	subject: string;
	classTime: string;
}

interface OtherInfo {
	fullName: string;
	kName: string;
	age: number;
	image: ImageData;
	sex: string;
	phoneNo: number;
	isOwn: boolean;
	ownerName: string;
	priesthood: string;
	isNewStudent: boolean;
	paymentId: string;
}

export type FormInfo = DateInfo & ClassInfo & OtherInfo;

export type Stats = {
	newOnes: number;
	oldOnes?: number;
	total?: number;
};

export interface StudentsListProps {
	classroom: string;
}

export interface IRegistrant extends Omit<OtherInfo, 'image'> {
	imageUrl: string;
	classDetails: ClassInfo;
	registryDate: DateInfo;
	confirmStatus: 'registered' | 'verified' | 'printed';
}

export interface IMongoRegistrant extends IRegistrant, Document {
	_id: Types.ObjectId;
	verifiedDate: Date;
	uniqueId: string;
}

export interface TextInputProps<T> {
	name: string;
	placeholder: string;
	value: T;
	handleChange: (newVal: string) => void;
}

export interface DropDownProps<T> {
	name: string;
	value: T;
	placeholder?: string;
	items: T[];
	handleChange: (newVal: string) => void;
}

export interface CheckBoxProps {
	name: string;
	placeholder: string;
	value: boolean;
	handleChange: () => void;
}

export type ReducerAction =
	| { type: 'reset form' }
	| { type: 'update field'; payload: Partial<FormInfo> };

export interface VerifyOneProps {
	student: VerifiedDetails;
	onRegister: (id: string) => void;
}

export interface VerifiedDetails {
	id: string;
	fullName: string;
	isNewStudent: boolean;
	classDetails: ClassInfo;
}

export interface IDDetailProps {
	fullName: string;
	phoneNo: number;
	uniqueId: string;
	classroom: string;
	subject: string;
	imageUrl: string;
}
