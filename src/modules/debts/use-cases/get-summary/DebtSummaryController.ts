import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { debtRepo } from "../../repos/implementation";

export class DebtSummaryController extends BaseController {
  protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 1) {
      return this.clientError(res, "Query parameters month (1-12) and year are required.");
    }

    try {
      const debts = await debtRepo.getAll(req.decoded.id);
      const now = new Date();
      const offsetFromNow = (year - now.getFullYear()) * 12 + (month - 1 - now.getMonth());

      const totalDebt = debts.reduce(
        (sum, debt) => sum + debt.amount.value * debt.installmentsTotal.value,
        0
      );
      const totalPaid = debts.reduce((sum, debt) => {
        const realPaid = debt.installmentsPaid.value;
        const totalInstallments = debt.installmentsTotal.value;
        const effectivePaid = offsetFromNow > 0
          ? Math.min(totalInstallments, realPaid + offsetFromNow)
          : Math.min(realPaid, Math.max(0, Math.min(totalInstallments, realPaid + offsetFromNow)));
        return sum + debt.amount.value * effectivePaid;
      }, 0);

      return this.ok(res, {
        totalDebt: Number(totalDebt.toFixed(2)),
        totalPaid: Number(totalPaid.toFixed(2)),
        totalRemaining: Number((totalDebt - totalPaid).toFixed(2)),
      });
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
