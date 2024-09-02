import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../auth/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
	constructor(private reportsService: ReportsService) { }

	@Get()
	getReports(@Query() report: GetEstimateDto) {
		return this.reportsService.getEstimate(report);
	}

	@Post()
	@Serialize(ReportDto)
	createReport(@Body() report: CreateReportDto, @CurrentUser() user: User) {
		return this.reportsService.createReport(report, user);
	}

	@Patch(':id')
	@UseGuards(AdminGuard)
	approveReport(@Param('id') id: string, @Body() { approved }: ApproveReportDto) {
		return this.reportsService.approveReport(id, approved);
	}
}
