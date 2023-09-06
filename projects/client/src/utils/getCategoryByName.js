  export default function getCategoryByName (id, categories) {
    return categories.find(category=> category.categoryId === id).categoryDesc
  }