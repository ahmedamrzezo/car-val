import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

export function Serialize<T>(dto: ClassConstructor<T>) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
	constructor(private dto: ClassConstructor<T>) { }
	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(map(data => {
			return plainToClass(this.dto, data, { excludeExtraneousValues: true });
		}));
	}
}