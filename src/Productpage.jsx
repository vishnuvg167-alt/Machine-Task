import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetPro,addPro,delPro,upPro} from "./redux/productSlice";

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

    if (!name.trim() || price === "") {
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


  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  
  const limit = 3;
  const totalPages = Math.ceil(filtered.length / limit);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const paginated = filtered.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit">
          {editId !== null ? "Update" : "Add"}
        </button>
      </form>

      <br />

      <input
        placeholder="Search Product"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <h2>Products</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {paginated.map((p) => (
        <div key={p.id}>
          {p.name} - ₹{p.price}

          <button onClick={() => handleEdit(p)}>
            Edit
          </button>

          <button onClick={() => handleDelete(p.id)}>
            Delete
          </button>
        </div>
      ))}

      {!loading && paginated.length === 0 && (
        <p>No products found</p>
      )}

      <br />

      <button disabled={currentPage === 1}
        onClick={() => setPage(currentPage - 1)}
      >
        Previous
      </button>

      <span>
        {" "}
        Page {currentPage} of {totalPages || 1}{" "}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => setPage(currentPage + 1)}
      >
        Next
      </button>
    </>
  );
}

export default Product;