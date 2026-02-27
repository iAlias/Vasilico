import { X, Flame, Dna, Wheat, Droplets } from "lucide-react";
import type { Recipe } from "../types";

interface RecipeViewModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeViewModal({ recipe, onClose }: RecipeViewModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3F20]/60 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold mb-3">
                {recipe.category}
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#1E3F20]">{recipe.title}</h3>
            </div>
            <button onClick={onClose} className="p-2 bg-zinc-50 text-zinc-400 hover:text-[#1E3F20] rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-50 p-4 rounded-2xl text-center">
              <Flame size={20} className="mx-auto text-orange-500 mb-2" />
              <p className="text-xl font-bold text-[#1E3F20]">{recipe.calories}</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Kcal</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl text-center">
              <Dna size={20} className="mx-auto text-rose-500 mb-2" />
              <p className="text-xl font-bold text-[#1E3F20]">{recipe.protein}g</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pro</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl text-center">
              <Wheat size={20} className="mx-auto text-amber-500 mb-2" />
              <p className="text-xl font-bold text-[#1E3F20]">{recipe.carbs}g</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Carbo</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl text-center">
              <Droplets size={20} className="mx-auto text-blue-500 mb-2" />
              <p className="text-xl font-bold text-[#1E3F20]">{recipe.fat}g</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Grassi</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-xl font-serif font-bold text-[#1E3F20] mb-4">Ingredienti</h4>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl">
                    <span className="font-medium text-[#1E3F20]">{ing.name}</span>
                    <span className="text-sm font-bold text-zinc-500">{ing.amount} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-serif font-bold text-[#1E3F20] mb-4">Istruzioni</h4>
              <p className="text-zinc-600 leading-relaxed p-4 bg-zinc-50 rounded-2xl">
                {recipe.instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
