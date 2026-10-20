import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetPro,
  addPro,
  delPro,
  upPro,
} from "./redux/productSlice";

function Product() {
  const { items: products, loading, error } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetPro());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || price === "" || Number(price) <= 0) {
      return;
    }

    const product = {
      name: name.trim(),
      price: Number(price),
    };

    try {
      if (editId !== null) {
        await dispatch(
          upPro({ ...product, id: editId })
        ).unwrap();
      } else {
        await dispatch(addPro(product)).unwrap();
      }

      setName("");
      setPrice("");
      setEditId(null);
    } catch (error) {
      alert(error.message || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await dispatch(delPro(id)).unwrap();

      if (editId === id) {
        setName("");
        setPrice("");
        setEditId(null);
      }
    } catch (error) {
      alert(error.message || "Failed to delete product");
    }
  };

  // Search
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const limit = 3;
  const totalPages = Math.ceil(filtered.length / limit);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const paginated = filtered.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="mt-2 text-gray-500">
            Add, edit, and manage your products
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold">
            {editId !== null ? "Edit Product" : "Add Product"}
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 sm:w-40"
            />

            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-700"
            >
              {editId !== null ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {/* Products */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold">
              Products ({filtered.length})
            </h2>

            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-900 sm:w-64"
            />
          </div>

          {loading && <p className="py-4 text-gray-500">Loading...</p>}

          {error && (
            <p className="py-4 text-red-600">Error: {error}</p>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium">
                      {p.name}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      ₹{p.price.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(p)}
                          className="cursor-pointer font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="cursor-pointer font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && paginated.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                No products found
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages || 1}
            </p>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Product;