import { useEffect, useState } from "react";
import { CategoryButton } from "./categoryButton";
import {
  Category,
  CreateCategoryDocument,
  DeleteCategoryDocument,
  GetUserCategoriesDocument,
} from "../generated/graphql";
import { useMutation, useQuery } from "@apollo/client";

export function NoteCategory({
  updateSelected,
}: {
  updateSelected: (name: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("");
  const [addCategoryName, setAddCategoryName] = useState("");
  const [categories, setCategories] = useState([] as Category[]);

  let { data } = useQuery(GetUserCategoriesDocument);
  const [deleteCategoryMutation] = useMutation(DeleteCategoryDocument);
  const [createCategoryMutation] = useMutation(CreateCategoryDocument);

  const addCategory = (name: string) => {
    createCategoryMutation({ variables: { name } }).then((cat) =>
      setCategories([cat as Category, ...categories])
    );
  };

  const deleteCategory = (id: string) => {
    deleteCategoryMutation({ variables: { categoryId: id } });
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const onCategoryButtonClick = (name: string) => {
    setActiveCategory(name);
    updateSelected(name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddCategoryName(e.target.value);
  };

  useEffect(() => {
    if (data?.getUserCategories !== undefined)
      setCategories(data.getUserCategories! as Category[]);
  }, [data]);

  return (
    <>
      <div className="flex flex-col flex-grow items-left">
        <div className="flex flex-row justify-between h-12">
          <p className="font-medium text-dark-blue text-lg">Note Category</p>
          <div className="">
            <input
              className=" bg-light-gray rounded-full rounded-r-none px-4 py-1 focus:outline-none text-dark-blue border-2 border-r-0 border-dark-blue"
              type="text"
              placeholder="add category"
              onChange={handleNameChange}
              value={addCategoryName}
            />
            <button
              onClick={() => {
                console.log(addCategoryName);
                addCategory(addCategoryName);
              }}
              className="bg-dark-blue rounded-full rounded-l-none px-4 py-1 border-2 border-l-0 border-dark-blue hover:border-light-blue"
            >
              add
            </button>
          </div>
        </div>
        <div className="flex flex-row flex-wrap">
          {/* categories go here */}
          {categories.map((cat) => (
            <CategoryButton
              key={cat.id}
              category={cat}
              active={activeCategory == cat.name}
              onCategoryButtonClick={onCategoryButtonClick}
              deleteCategory={deleteCategory}
            />
          ))}
        </div>
      </div>
    </>
  );
}
