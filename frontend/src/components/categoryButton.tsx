import { Category } from "../generated/graphql";

export function CategoryButton({
  category,
  active,
  onCategoryButtonClick,
  deleteCategory,
}: {
  category: Category;
  active: Boolean;
  onCategoryButtonClick: (name: string) => void;
  deleteCategory: (id: string) => void;
}) {
  return (
    <>
      <p
        className={
          "group flex flex-row justify-center items-center category-item rounded-full px-4 py-1 m-2 mt-0 cursor-pointer " +
          (active
            ? "text-light-gray bg-dark-blue"
            : "bg-light-gray text-dark-blue")
        }
        onClick={() => onCategoryButtonClick(category.name)}
      >
        {category.name}
        <button
          className={
            "hidden -mr-3 -ml-4 -my-3 border-none group-hover:block p-1 rounded-full " +
            (active ? "bg-dark-blue " : "bg-light-gray")
          }
          onClick={() => deleteCategory(category.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.6 18 2 14.4 2 10C2 5.6 5.6 2 10 2C14.4 2 18 5.6 18 10C18 14.4 14.4 18 10 18Z"
              fill="currentColor"
            />
            <path
              d="M14 5.99995C13.6 5.59995 13 5.59995 12.6 5.99995L9.99995 8.59995L7.39995 5.99995C6.99995 5.59995 6.39995 5.59995 5.99995 5.99995C5.59995 6.39995 5.59995 6.99995 5.99995 7.39995L8.59995 9.99995L5.99995 12.6C5.59995 13 5.59995 13.6 5.99995 14C6.19995 14.2 6.49995 14.3 6.69995 14.3C6.89995 14.3 7.19995 14.2 7.39995 14L9.99995 11.4L12.6 14C12.8 14.2 13.1 14.3 13.3 14.3C13.5 14.3 13.8 14.2 14 14C14.4 13.6 14.4 13 14 12.6L11.4 9.99995L14 7.39995C14.4 6.99995 14.4 6.39995 14 5.99995Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </p>
    </>
  );
}
