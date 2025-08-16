"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CompanyDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">إضافة شركة</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة شركة جديدة</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="اسم الشركة"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="المقر الرئيسي"
            className="w-full border p-2 rounded"
          />
          <Button type="submit">حفظ</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
