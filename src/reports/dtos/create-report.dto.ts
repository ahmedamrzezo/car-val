import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReportDto {

	@IsString()
	make: string;

	@IsString()
	model: string;

	@IsNumber()
	@Min(0)
	@Max(1000000)
	price: number;
	
	@IsNumber()
	@Min(1970)
	@Max(new Date().getFullYear() + 1)
	year: number;
	
	@IsLongitude()
	lng: number;
	
	@IsLatitude()
	lat: number;
	
	@IsNumber()
	@Min(0)
	@Max(1000000)
	mileage: number;
}