export type IngredientType = {
  id: number,
  name: string,
  clean: number,
  gross: number,
}
export type RecipeIngredient = 
{ id: number,
  name: string,
  clean: number,
  gross: number,
  weight: number,
   priceForKg: number}

export type RecipeType = {
  id: number,
  name: string,
  sellingPrice: number,
  userId: number,
  recipeGroceries: {groceryId: number,priceForKg: number, weight: number}[],
}