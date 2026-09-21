-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "styleId" TEXT;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "ProductCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
