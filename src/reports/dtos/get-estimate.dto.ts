import { Transform } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";

export class GetEstimateDto {
	@IsString()
	make: string;

	@IsString()
	model: string;
	
	@Transform(({ value }) => +value)
	@IsNumber()
	@Min(1970)
	@Max(new Date().getFullYear() + 1)
	year: number;
	
	@Transform(({ value }) => +value)
	@IsLongitude()
	lng: number;
	
	@Transform(({ value }) => +value)
	@IsLatitude()
	lat: number;
	
	@Transform(({ value }) => +value)
	@IsNumber()
	@Min(0)
	@Max(1000000)
	mileage: number;
}