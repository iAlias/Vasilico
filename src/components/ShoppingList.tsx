import { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Printer,
  ChevronRight,
  Utensils
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import type { ShoppingItem } from "../types";
import { storage } from "../services/storageService";

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    setItems(storage.getShoppingList());
    setLoading(false);
  };

  const toggleItem = (id: number, checked: boolean) => {
    storage.updateShoppingItem(id, !checked);
    fetchList();
  };

  const clearList = () => {
    storage.clearShoppingList();
    fetchList();
  };

  const handlePrint = () => {
    const printContent = document.getElementById('shopping-list-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Lista della Spesa - Vasilicò</title>
            <style>
              body { font-family: sans-serif; padding: 20px; color: #1E3F20; }
              h1 { font-family: serif; font-size: 24px; margin-bottom: 20px; }
              h2 { font-family: serif; font-size: 18px; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              ul { list-style: none; padding: 0; }
              li { padding: 8px 0; border-bottom: 1px dashed #eee; display: flex; justify-content: space-between; }
              .checked { text-decoration: line-through; color: #888; }
            </style>
          </head>
          <body>
            <h1>Lista della Spesa</h1>
            ${categories.map(cat => `
              <h2>${cat}</h2>
              <ul>
                ${items.filter(i => i.category === cat).map(item => `
                  <li class="${item.is_checked ? 'checked' : ''}">
                    <span>${item.name}</span>
                    <span>${item.amount} ${item.unit}</span>
                  </li>
                `).join('')}
              </ul>
            `).join('')}
            <script>
              window.onload = () => {
                window.print();
                setTimeout(() => window.close(), 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print(); // Fallback
    }
  };

  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <div className="space-y-12" id="shopping-list-content">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-serif font-bold tracking-tight text-[#1E3F20]">Lista Spesa</h2>
          <p className="text-zinc-400 font-medium mt-2">Aggiornata automaticamente in base al tuo piano pasti.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm"
          >
            <Printer size={18} className="text-zinc-400" />
            Stampa
          </button>
          <button 
            onClick={clearList}
            className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-all"
          >
            <Trash2 size={18} />
            Svuota
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-[2.5rem]" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-zinc-200">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="text-zinc-200" size={40} />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1E3F20] mb-2">La tua lista è vuota</h3>
          <p className="text-zinc-400 font-medium max-w-xs mx-auto">Pianifica dei pasti nel calendario per generare automaticamente la tua lista della spesa.</p>
          <button 
            onClick={() => window.location.hash = "#meals"} // This is a hack, in a real app we'd use the setActiveView prop if passed
            className="mt-8 text-[#3A6345] font-bold text-sm hover:text-[#5A4C36] transition-colors flex items-center gap-2 mx-auto"
          >
            Vai al Piano Pasti <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {categories.map((category) => (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-[#1E3F20] rounded-lg flex items-center justify-center text-[#4A7C59]">
                  <Utensils size={16} />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1E3F20]">{category}</h3>
                <span className="ml-auto text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                  {items.filter(i => i.category === category).length} articoli
                </span>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-zinc-50">
                  {items
                    .filter(item => item.category === category)
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id, item.is_checked)}
                        className="w-full flex items-center gap-4 p-6 hover:bg-zinc-50 transition-all text-left group"
                      >
                        <div className={cn(
                          "transition-colors",
                          item.is_checked ? "text-[#4A7C59]" : "text-zinc-200 group-hover:text-zinc-300"
                        )}>
                          {item.is_checked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-bold transition-all",
                            item.is_checked ? "text-zinc-400 line-through" : "text-[#1E3F20]"
                          )}>
                            {item.name}
                          </p>
                          <p className="text-xs font-medium text-zinc-400">
                            {item.amount.toFixed(1)} {item.unit}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, header, button, .flex-col.md\\:flex-row { display: none !important; }
          main { padding: 0 !important; }
          .grid { display: block !important; }
          .bg-white { border: none !important; box-shadow: none !important; }
          .p-8, .p-12 { padding: 0 !important; }
          .space-y-12 { space-y: 4 !important; }
          h2 { font-size: 24pt !important; margin-bottom: 20pt !important; }
          .rounded-[2.5rem], .rounded-[3rem] { border-radius: 0 !important; }
        }
      `}} />
    </div>
  );
}
