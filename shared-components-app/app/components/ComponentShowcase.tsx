'use client';

import { useState } from 'react';
import styles from './ComponentShowcase.module.css';

/**
 * Component Showcase
 * Demonstrates usage of shared components with dummy data
 */
export default function ComponentShowcase() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    item1: false,
    item2: true,
    item3: false,
  });
  const [selectedOption, setSelectedOption] = useState('option1');
  const [currentPage, setCurrentPage] = useState(1);

  // Dummy data for showcase
  const dummyProducts = [
    { id: 1, name: 'Product A', price: 500, status: 'In Stock' },
    { id: 2, name: 'Product B', price: 1200, status: 'Low Stock' },
    { id: 3, name: 'Product C', price: 750, status: 'Out of Stock' },
    { id: 4, name: 'Product D', price: 2500, status: 'In Stock' },
    { id: 5, name: 'Product E', price: 999, status: 'In Stock' },
  ];

  const dummyStatus = {
    completed: 15,
    pending: 8,
    failed: 3,
  };

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const handleCheckChange = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Shared Components Library Showcase</h1>
      <p className={styles.subtitle}>
        Interactive demonstration of all shared components with dummy data
      </p>

      {/* Buttons Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔘 Buttons</h2>
        <div className={styles.componentGrid}>
          <button className={styles.btn} onClick={() => alert('Primary button clicked!')}>
            Primary Button
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`}>
            Secondary Button
          </button>
          <button className={`${styles.btn} ${styles.btnSuccess}`}>
            Success Button
          </button>
          <button className={`${styles.btn} ${styles.btnDanger}`} disabled>
            Disabled Button
          </button>
        </div>
      </section>

      {/* Checkboxes Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>✓ Checkboxes</h2>
        <div className={styles.checkboxGroup}>
          {Object.entries(checkedItems).map(([key, value]) => (
            <label key={key} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleCheckChange(key)}
              />
              <span>{`Checkbox ${key.replace('item', '')}`}</span>
            </label>
          ))}
        </div>
        <p className={styles.info}>Checked items: {Object.values(checkedItems).filter(Boolean).length}</p>
      </section>

      {/* Select/Dropdown Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📋 Select Dropdown</h2>
        <div className={styles.formGroup}>
          <label htmlFor="select-demo">Choose an option:</label>
          <select
            id="select-demo"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className={styles.select}
          >
            {selectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className={styles.info}>Selected: {selectedOption}</p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📑 Tabs</h2>
        <div className={styles.tabs}>
          {['All Orders', 'Pending', 'Completed', 'Failed'].map((tab, idx) => (
            <button
              key={idx}
              className={`${styles.tabButton} ${selectedTab === idx ? styles.activeTab : ''}`}
              onClick={() => setSelectedTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.tabContent}>
          {selectedTab === 0 && <p>Showing all orders (5 total)</p>}
          {selectedTab === 1 && <p>Showing pending orders (3 total)</p>}
          {selectedTab === 2 && <p>Showing completed orders (1 total)</p>}
          {selectedTab === 3 && <p>Showing failed orders (1 total)</p>}
        </div>
      </section>

      {/* Table Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📊 Table with Data</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        product.status === 'In Stock'
                          ? styles.badgeSuccess
                          : product.status === 'Low Stock'
                          ? styles.badgeWarning
                          : styles.badgeDanger
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Status Cards Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📈 Status Summary Cards</h2>
        <div className={styles.cardGrid}>
          <div className={`${styles.card} ${styles.cardBlue}`}>
            <div className={styles.cardValue}>{dummyStatus.completed}</div>
            <div className={styles.cardLabel}>Completed</div>
          </div>
          <div className={`${styles.card} ${styles.cardYellow}`}>
            <div className={styles.cardValue}>{dummyStatus.pending}</div>
            <div className={styles.cardLabel}>Pending</div>
          </div>
          <div className={`${styles.card} ${styles.cardRed}`}>
            <div className={styles.cardValue}>{dummyStatus.failed}</div>
            <div className={styles.cardLabel}>Failed</div>
          </div>
        </div>
      </section>

      {/* Product Cards Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🛍️ Product Card Grid</h2>
        <div className={styles.productGrid}>
          {dummyProducts.slice(0, 3).map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <div className={styles.imagePlaceholder}>Product Image</div>
              </div>
              <h3>{product.name}</h3>
              <p className={styles.price}>₹{product.price}</p>
              <p className={styles.status}>{product.status}</p>
              <button className={`${styles.btn} ${styles.btnSmall}`}>View Details</button>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📂 Accordion/Collapsible Items</h2>
        <div className={styles.accordionGroup}>
          {['What is this component?', 'How to use it?', 'Features included'].map((title, idx) => (
            <details key={idx} className={styles.accordionItem}>
              <summary>{title}</summary>
              <p>This is sample content for accordion item {idx + 1}. You can add more details here.</p>
            </details>
          ))}
        </div>
      </section>

      {/* Pagination Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📖 Pagination</h2>
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationBtn}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <div className={styles.pageInfo}>
            Page <strong>{currentPage}</strong> of <strong>5</strong>
          </div>
          <button
            className={styles.paginationBtn}
            disabled={currentPage === 5}
            onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
          >
            Next →
          </button>
        </div>
      </section>

      {/* Info Grid Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ℹ️ Information Grid</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.label}>Total Users</div>
            <div className={styles.value}>1,234</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>Active Sessions</div>
            <div className={styles.value}>567</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>Total Orders</div>
            <div className={styles.value}>8,901</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>Revenue</div>
            <div className={styles.value}>₹45,67,890</div>
          </div>
        </div>
      </section>

      {/* Notice Card Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⚠️ Notice Cards</h2>
        <div className={`${styles.noticeCard} ${styles.noticeInfo}`}>
          <strong>ℹ️ Info:</strong> This is an informational notice about the system.
        </div>
        <div className={`${styles.noticeCard} ${styles.noticeWarning}`}>
          <strong>⚠️ Warning:</strong> This is a warning notice that requires attention.
        </div>
        <div className={`${styles.noticeCard} ${styles.noticeError}`}>
          <strong>❌ Error:</strong> This is an error notice indicating a problem.
        </div>
        <div className={`${styles.noticeCard} ${styles.noticeSuccess}`}>
          <strong>✅ Success:</strong> This is a success notice confirming an action.
        </div>
      </section>

      {/* Input/Search Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔍 Search Input</h2>
        <input
          type="text"
          placeholder="Enter search query (debounced)..."
          className={styles.searchInput}
        />
      </section>

      {/* Footer Info */}
      <section className={styles.section}>
        <p className={styles.footerNote}>
          All these components are from the shared components library. Customize them as per your
          project requirements.
        </p>
      </section>
    </div>
  );
}
