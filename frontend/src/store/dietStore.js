import { create } from 'zustand';

export const useDietStore = create((set) => ({
    todaysDiet: [],
    targets: {
        calories: 2500,
        protein: 180,
        carbs: 250,
        fats: 75
    },
    currentMacros: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    },

    addFoodItem: (item) => set((state) => {
        const updatedDiet = [...state.todaysDiet, item];
        
        // Recalculate macros
        const updatedMacros = updatedDiet.reduce((acc, curr) => ({
            calories: acc.calories + (curr.calories || 0),
            protein: acc.protein + (curr.protein || 0),
            carbs: acc.carbs + (curr.carbs || 0),
            fats: acc.fats + (curr.fats || 0)
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        return {
            todaysDiet: updatedDiet,
            currentMacros: updatedMacros
        };
    }),

    removeFoodItem: (id) => set((state) => {
        const itemIdx = state.todaysDiet.findIndex(item => item.id === id);
        if (itemIdx === -1) return state;

        const updatedDiet = [...state.todaysDiet];
        updatedDiet.splice(itemIdx, 1);

        const updatedMacros = updatedDiet.reduce((acc, curr) => ({
            calories: acc.calories + (curr.calories || 0),
            protein: acc.protein + (curr.protein || 0),
            carbs: acc.carbs + (curr.carbs || 0),
            fats: acc.fats + (curr.fats || 0)
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        return {
            todaysDiet: updatedDiet,
            currentMacros: updatedMacros
        };
    }),

    overwriteDiet: (items) => set((state) => {
        const updatedMacros = items.reduce((acc, curr) => ({
            calories: acc.calories + (curr.calories || 0),
            protein: acc.protein + (curr.protein || 0),
            carbs: acc.carbs + (curr.carbs || 0),
            fats: acc.fats + (curr.fats || 0)
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        return {
            todaysDiet: items,
            currentMacros: updatedMacros
        };
    })
}));
