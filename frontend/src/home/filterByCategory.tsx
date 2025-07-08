import { useState } from "react";
import { CategoryButton } from "../components/categoryButton";
import { Category } from "../generated/graphql";

const categories = [
  { name: "cat 1", id: 1 },
  { name: "cat 2", id: 2 },
  { name: "cat 3", id: 3 },
];

export function FilterByCategory({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.name ?? ""
  );
  const onCategoryButtonClick = (name: string) => {
    setActiveCategory(name);
  };
  const categoryListItems = categories.map((cat) => (
    <CategoryButton
      deleteCategory={() => {}}
      category={cat}
      active={activeCategory == cat.name}
      onCategoryButtonClick={onCategoryButtonClick}
    />
  ));

  return (
    <>
      <div className="flex flex-col flex-grow items-left">
        <div className="flex flex-row justify-between h-12">
          <p className="font-medium text-dark-blue text-lg">
            Filter By Category
          </p>
          <div className="">
            <input
              className=" bg-light-gray rounded-full rounded-r-none px-4 py-1 focus:outline-none text-dark-blue border-2 border-r-0 border-dark-blue"
              type="text"
              placeholder="add category"
            />
            <button className="bg-dark-blue rounded-full rounded-l-none px-4 py-1 border-2 border-l-0 border-dark-blue hover:border-light-blue">
              add
            </button>
          </div>
        </div>
        <div className="flex flex-row flex-wrap">
          {/* categories go here */}
          {categoryListItems}
        </div>
      </div>
    </>
  );
}
