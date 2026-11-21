import {BrowserRouter, Routes, Route, Link, useParams} from "react-router-dom";
import { useState } from 'react'
import './App.css'

const initialProducts=[
  {id: 1, name: "Pulpen", price: 5000, stock: 100,
    brand: "Pilot",
    category: "Alat Tulis",
    description: "Pulpen tinta hitam untuk menulis.",
    specs: [
      {label: "Warna tinta", value: "Hitam"},
      {label: "Jenis tinta", value: "Gel"},
      {label: "panjang", value: "0.5 mm"},
      {label: "Bahan", value: "Plastic"},
    ],
  },
  {id: 2, name: "Buku Tulis", price: 12000, stock: 50,
    brand: "Sinar Dunia",
    category: "Alat Tulis",
    description: "Buku tulis binder yang berwarna-warni.",
    specs: [
      {label: "Jumlah Halaman", value: "38 halaman"},
      {label: "Ukuran", value: "A5"},
      {label: "Cover", value: "Soft Cover"},
      {label: "Jenis kertas", value: "HVS"},
    ],
  },
  {id: 3, name: "Spidol", price: 8000, stock: 85,
    brand: "Snowman",
    category: "Alat mengajar",
    description: "Spidol papan tulis yang tak mengotori tangan.",
    specs: [
      {label: "Warna tinta", value: "Hitam dan Biru"},
      {label: "Jenis tinta", value: "Permanen, erasable"},
    ],
  },
  {id: 4, name: "Penggaris", price: 6000, stock: 100,
    brand: "Butterfly",
    category: "Alat mengajar",
    description: "Penggaris terkenal di Indonesia. Jangan bengkokin",
    specs:[
      {label: "Akurasi", value: "0.01 mmm"},
      {label: "Panjang", value: "20 cm"},
    ],
  },
  {id: 5, name: "Penghapus", price: 3000, stock: 150,
    brand: "Agatis",
    category: "Alat tulis",
    description: "Penghapus yang sangat rapi dan bersih dalam menghapus meskipun kecil.",
    specs: [
      {label: "Bahan", value: "karet"},
      {label: "Ketahanan", value: "3 tahun"},
    ],
  },
];

const Price = (value) => "Rp" + value.toLocaleString("id-ID");
const specsToText = (specs) => specs.map((s) => `${s.label}:${s.value}`).join("\n");

function textToSpecs(text){
  return text
    .split("\n")
    .map((line) => {
      const i = line.indexOf(":");
      if (i === -1) return null;
      return {label: line.slice(0,i).trim(), value: line.slice(i + 1).trim()};
    })
    .filter((s) => s && s.label && s.value);
}

function NotFound({message = "Halaman yang kamu cari tak ada atau suda dipindahkan"}){
  return(
    <main>
      <p className="page not-found"></p>
      <h1>Halaman tidak ditemukan</h1>
      <p className="muted">{message}</p>
      <Link className="btn primary" to="/">
        Kembali ke beranda
      </Link>
    </main>
  );
}

function ProductCard({product, onEdit, onDelete}){//display
  return(
    <article className="card">
      <small>ID: {product.id}</small>
      <h3>{product.name}</h3>
      <p className="price">{Price(product.price)}</p>
      <Link className="detail-link" to={`/produk/${product.id}`}>
        Lihat detail →
      </Link>
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

function Modal({children, onClose}){//popup
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

function ProductForm({product, onSave, onClose}){//card yang tampilin prpoduk
  const isEdit = product != null;
  const [name, setName] = useState(isEdit ? product.name : "");
  const [price, setPrice] = useState(isEdit ? String(product.price) : "");
  const [brand, setBrand] = useState(isEdit ? product.brand : "");
  const [description, setDescription] = useState(isEdit ? product.description : "");
  const [specsText, setSpecsText] = useState(isEdit ? specsToText(product.specs) : "");
  const [error, setError] = useState("");
 

  function handleSubmit(){
    if(name.trim() === "") return setError("Nama produk wajib diisi.");
    if(Number(price) <= 0) return setError("Harga harus di atas 0.");
    onSave({name: name.trim(), 
      price: Number(price),
      brand: brand.trim(),
      description: description.trim(),
      specs: textToSpecs(specsText),
    });
  }

  return(
    <Modal onClose={onClose}>
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
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder= "Contoh: Pulpen"/>
        </label>
        <label>
          Harga(Rp)
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder= "Contoh: 5000"/>
        </label>
        <label>
          Merek
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Contoh: Faber-Castell"/>
        </label>
        <label>
          Deskripsi
          <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)}/>
        </label>
        <label>
          Spesifikasi
          <textarea rows={4} value={specsText} onChange={(e) => setSpecsText(e.target.value)}
            placeholder={"RAM: 16 GB\nProssesor: Intel Core i5"}
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
        <p className="price">{Price(product.price)}</p>
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

function ProductListPage({products, setProducts}){
  const [keyword, setKeyword] = useState("");
  const [modal, setModal] = useState(null);
  const filtered = products.filter((p)=>
    p.name.toLowerCase().includes(keyword.toLowerCase())
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
        <button className="btn primary" onClick={() => setModal({type: "add"})}>
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
        <ProductForm product={null} onSave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal?.type === "edit" && (
        <ProductForm product={modal.product} onSave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal?.type === "delete" && (
        <DeleteConfirm product={modal.product} onConfirm={handleDelete} onClose={() => setModal(null)} />
      )}
    </main>
  );
}

function ProductDetailPage({products}){
  const {id} = useParams();
  const product = products.find((p) => String(p.id) === id);

  if(!product){
    return <NotFound message="Produk dengan ID tersebut tidak ditemukan"/>
  }

  return(
    <main className="page">
      <Link className="back" to="/">
        ← Kembali ke daftar
      </Link>
      <article className="detail">
        <small>ID: {product.id}</small>
        <h1>{product.name}</h1>
        <p className="price big">{Price(product.price)}</p>
        <span className="badge">Merek: {product.brand || "-"}</span>
        <p>{product.description || "Belum ada deskripsi"}</p>

        <h2>Spesifikasi</h2>
        {product.specs.length === 0 ? (
          <p className="muted">Belum ada Spesifikasi</p>
        ) : (
          <table className="specs">
            <tbody>
              {product.specs.map((s) => 
                (
                  <tr key={s.label}>
                    <th>{s.label}</th>
                    <th>{s.value}</th>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </article>
    </main>
  );
}

export default function App(){
  const [products, setProducts] = useState(initialProducts);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductListPage products={products} setProducts={setProducts}/>}/>
        <Route path="/produk/:id" element={<ProductDetailPage products={products}/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}