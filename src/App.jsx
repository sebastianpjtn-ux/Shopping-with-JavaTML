import { useState } from 'react'
import './App.css'

const initialProducts=[
  {id: 1, name: "Pulpen", price: 5000},
  {id: 2, name: "Buku Tulis", price: 12000},
  {id: 3, name: "Spidol", price: 8000},
  {id: 4, name: "Penggaris", price: 6000},
  {id: 5, name: "Penghapus", price: 3000},
];

const Price = (value) => "Rp" + value.toLocalString("id-ID");

function ProductCard({product, onEdit, onDelete}){//display
  return(
    <article className="card">
      <small>ID: {product.id}</small>
      <h3>{product.name}</h3>
      <p className="Price">{formatPrice(product.price)}</p>
      <div className="actions">
        <button className="btn outline" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button className="btn outline danger" onClick={() => onDelete(product)}>
          Hapus
        </button>
      </div>
    </article>
  );
}

function Modal({ children, onClose}){//popup
  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Tutup">
          x
        </button>
        {children}
      </div>
    </div>
  );
}

function ProductForm({product, onSave, onClose}){
  const isEdit = product != null;
  const [name, setName] = useState(isEdit ? product.name : "");
  const [price, setPrice] = useState(isEdit ? String(product.price) : "");
  const [error, setError] = useState("");

  function handleSubmit(){
    if(name.trim() === "") return setError("Nama produk wajib diisi.");
    if(Number(price) <= 0) return setError("Harga harus di atas 0.");
    onSave({name: name.trim(), price: Number(price)});
  }

  return(
    <Modal onCose={onClose}>
      <h2>{isEdit ? "Edit Produk" : "Tambah Produk"}</h2>
      <p className="muted">
        {isEdit
          ? "Perbarui informasi produk yang dipilih"
          : "Masukkan info produk baru"
        }
      </p>
      {isEdit && <small>ID: {product.id}</small>}

        <label>
          Nama produk
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder= "Contoh: Pulpen"
            />
        </label>
        <label>
          Harga(Rp)
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder= "Contoh: 5000"
            />
        </label>
        <small className={error ? "error" : "muted"}>
          {error || "Harga harus lebih dari 0"}
        </small>

        <div className="actions end">
          <button className="btn outline" onClick={onClose}>
            Batal
          </button>
          <button className="btn primary" onClick={handleSubmit}>
            {isEdit ? "Simpan Perubahan" : "Simpan Produk"}
          </button>
        </div>
    </Modal>
  );
}

function DeleteConfirm({ product, onConfirm, onClose}){
  return(
    <Modal onClose={onClose}>
      <h2>Hapus Produk ?</h2>
      <p className="muted">Produk yang dihapus tak dapat dikembalikan</p>
      <div className="preview">
        <small>ID: {product.id}</small>
        <h3>{product.name}</h3>
        <p className="price">{formatPrice(product.price)}</p>
      </div>
      <div className="actions end">
        <button className="btn outline" onClick={onClose}>
          Batal
        </button>
        <button className="btn danger-solid" onClick={onConfirm}>
          Hapus Produk
        </button>
      </div>
    </Modal>
  );
}

export default function App(){
  const [products, setProducts] = useState(initialProducts);
  const [keyword, setKeyword] = useState("");
  const [modal, setModal] = useState(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLocaleLowerCase())
  );

  function handleSave(data){
    if(modal.type === "edit"){
      setProducts(
        products.map((p) => (p.id === modal.product.id ? {...p, ...data} : p))
      );
    }else{
      const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
      setProducts([...products, {id:nextId, ...data}]);
    }
    setModal(null);
  }
  function handleDelete(){
    setProducts(products.filter((p) => p.id !== modal.product.id));
    setModal(null);
  }

  return(
    <main className="page">
      <header className="top">
        <div>
          <h1>Manajemen produk</h1>
          <p className="muted">Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>
        <button className="btn primary" onClick={() => setModal({type: "Add"})}>
          +Tambah Produk
        </button>
      </header>

      <div className="toolbar">
        <input
          className = "search"
          value = {keyword}
          onChange = {(e) => setKeyword(e.target.value)}
          placeholder="Cari nama produk..."
        />
        <span className="muted">{products.length} product</span>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">Tidak ada produk yang cocok. Coba kata kunci lain</p>
      ) : (
        <section className="grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(p) => setModal({type: "edit", product: p})}
              onDelete={(p) => setModal({type: "delete", product: p})}
            />      
          ))}
        </section>
      )}

      <p className="muted small">
        Menampilkan {filtered.length} dari {products.length} produk
      </p>

      {modal?.type === "add" && (
        <ProductForm product={null} onSsave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal?.type === "edit" && (
        <ProductForm product={modal.product} onSsave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal?.type === "delete" && (
        <ProductForm product={modal.product} onSsave={handleDelete} onClose={() => setModal(null)} />
      )}
    </main>
  );
}