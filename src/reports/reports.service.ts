import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Report from './report.entity';
import { User } from '../auth/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

	findReport(id: string) {
		return this.repo.findOneBy({ id });
	}

	createReport(report: CreateReportDto, user: User) {
		const reportEntity = this.repo.create(report);
		reportEntity.user = user;
		return this.repo.save(reportEntity);
	}

	async approveReport(id: string, approved: boolean) {
		const report = await this.findReport(id);
		if (!report) {
			throw new NotFoundException('Report not found');
		}
		report.approved = approved;
		return this.repo.save(report);
	}

	getEstimate({ make, model, year, mileage, lat, lng }: GetEstimateDto) {
		return this.repo.createQueryBuilder()
			.select('AVG(price)', 'price')
			.where('make = :make', { make })
			.andWhere('model = :model', { model })
			.andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
			.andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
			.andWhere('year - :year BETWEEN -3 AND 3', { year })
			.andWhere('approved IS TRUE')
			.orderBy('ABS(mileage - :mileage)', 'DESC')
			.setParameters({ mileage })
			.limit(3)
			.getRawOne();
	}
}
