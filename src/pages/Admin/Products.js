import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiUpload } from 'react-icons/fi';
import axios from 'axios';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'sofa',
    quantity: '',
    discount: 0,
    images: [],
    specifications: {
      material: '',
      dimensions: '',
      weight: '',
      color: ''
    }
  });
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const categories = [
    { value: 'sofa', label: 'Sofa' },
    { value: 'chair', label: 'Chair' },
    { value: 'table', label: 'Table' },
    { value: 'bed', label: 'Bed' },
    { value: 'wardrobe', label: 'Wardrobe' },
    { value: 'cabinet', label: 'Cabinet' },
    { value: 'bookshelf', label: 'Bookshelf' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'sofa',
      quantity: '',
      discount: 0,
      images: [],
      specifications: {
        material: '',
        dimensions: '',
        weight: '',
        color: ''
      }
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('spec_')) {
      const specField = name.replace('spec_', '');
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('/api/products/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        return response.data.imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        discount: parseFloat(formData.discount) || 0
      };

      if (editingProduct) {
        // Update existing product
        await axios.put(`/api/products/${editingProduct._id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        await axios.post('/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product added successfully!');
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      quantity: product.quantity.toString(),
      discount: product.discount || 0,
      images: product.images || [],
      specifications: product.specifications || {
        material: '',
        dimensions: '',
        weight: '',
        color: ''
      }
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Product Management</h1>
            <p className="admin-subtitle">Manage your furniture inventory</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="admin-btn admin-btn-primary"
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="admin-modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={resetForm} className="admin-modal-close">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-grid">
                  {/* Basic Info */}
                  <div className="admin-form-section">
                    <h3>Basic Information</h3>
                    
                    <div className="admin-form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="admin-input"
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="admin-textarea"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="admin-select"
                          required
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label>Price (₹) *</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="admin-input"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Quantity *</label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className="admin-input"
                          min="0"
                          required
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Discount (%)</label>
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          className="admin-input"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="admin-form-section">
                    <h3>Specifications</h3>
                    
                    <div className="admin-form-group">
                      <label>Material</label>
                      <input
                        type="text"
                        name="spec_material"
                        value={formData.specifications.material}
                        onChange={handleInputChange}
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Dimensions</label>
                      <input
                        type="text"
                        name="spec_dimensions"
                        value={formData.specifications.dimensions}
                        onChange={handleInputChange}
                        className="admin-input"
                        placeholder="e.g., 120cm x 80cm x 75cm"
                      />
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Weight</label>
                        <input
                          type="text"
                          name="spec_weight"
                          value={formData.specifications.weight}
                          onChange={handleInputChange}
                          className="admin-input"
                          placeholder="e.g., 25kg"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Color</label>
                        <input
                          type="text"
                          name="spec_color"
                          value={formData.specifications.color}
                          onChange={handleInputChange}
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="admin-form-section admin-form-full">
                    <h3>Product Images</h3>
                    
                    {/* URL Input */}
                    <div className="admin-form-group">
                      <label>Add Image URL</label>
                      <div className="admin-url-input-group">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="admin-input"
                          placeholder="https://example.com/image.jpg"
                        />
                        <button
                          type="button"
                          onClick={addImageUrl}
                          className="admin-btn admin-btn-secondary"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="admin-image-upload">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="admin-file-input"
                        id="image-upload"
                        disabled={uploadingImages}
                      />
                      <label htmlFor="image-upload" className={`admin-upload-btn ${uploadingImages ? 'uploading' : ''}`}>
                        <FiUpload className="w-5 h-5" />
                        {uploadingImages ? 'Uploading...' : 'Upload Files'}
                      </label>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="admin-image-preview">
                        {formData.images.map((image, index) => (
                          <div key={index} className="admin-image-item">
                            <img 
                              src={image.startsWith('http') ? image : `${window.location.origin}${image}`} 
                              alt={`Preview ${index + 1}`}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="admin-image-remove"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    <FiSave className="w-5 h-5" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <h2>Products ({products.length})</h2>
          </div>

          {products.length === 0 ? (
            <div className="admin-empty-state">
              <p>No products found. Add your first product to get started!</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Discount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="admin-product-image">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].startsWith('http') 
                                ? product.images[0] 
                                : `${window.location.origin}${product.images[0]}`}
                              alt={product.name}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="admin-no-image">No Image</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admin-product-info">
                          <h4>{product.name}</h4>
                          <p>{product.description.substring(0, 50)}...</p>
                        </div>
                      </td>
                      <td>
                        <span className="admin-category-badge">
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <div className="admin-price">
                          ₹{product.discountedPrice?.toLocaleString() || product.price.toLocaleString()}
                          {product.discount > 0 && (
                            <small>₹{product.price.toLocaleString()}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-stock-badge ${product.quantity < 10 ? 'low' : 'normal'}`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td>
                        {product.discount > 0 ? `${product.discount}%` : '-'}
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            onClick={() => handleEdit(product)}
                            className="admin-action-btn admin-edit-btn"
                            title="Edit Product"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="admin-action-btn admin-delete-btn"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
