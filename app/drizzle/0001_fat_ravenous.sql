ALTER TABLE "investments" DROP CONSTRAINT "investments_investor_id_investors_id_fk";
--> statement-breakpoint
ALTER TABLE "investments" DROP CONSTRAINT "investments_fund_id_funds_id_fk";
--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_fund_id_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."funds"("id") ON DELETE cascade ON UPDATE no action;