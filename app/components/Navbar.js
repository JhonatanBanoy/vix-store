'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from "../styles/Navbar.module.css";
import { useCart } from '../../../my_project/context/CartContext';
import { Dropdown, Menu, Button, Avatar } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { cartItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserName(user?.name || '');
        setUserImage(user?.profileImage || `https://api.dicebear.com/7.x/avatars/svg?seed=${user?.email}`);
      } catch {
        setUserName('');
      }
    }
  }, [pathname]);

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      setUserName('');
      router.push('/');
    } else if (key === 'profile') {
      router.push('/profile');
    } else if (key === 'dashboard') {
      router.push('/dashboard');
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Perfil</Menu.Item>
      <Menu.Item key="dashboard">Dashboard</Menu.Item>
      <Menu.Item key="logout">Cerrar sesión</Menu.Item>
    </Menu>
  );

  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandGem}>◆</span> Luxe Joyas
        </Link>

        <ul className={styles.navLinks}>
          <li><Link href="/" className={pathname === '/' ? styles.active : ''}>Inicio</Link></li>
          <li><Link href="/products" className={pathname.startsWith('/products') ? styles.active : ''}>Productos</Link></li>
          <li><Link href="/contact" className={pathname.startsWith('/contact') ? styles.active : ''}>Contacto</Link></li>
        </ul>

        <div className={styles.navActions}>
          <Link href="/cart" className={`${styles.cartButton} ${styles.cartlink}`}>
            <i className="bi bi-bag" />
            {cartTotal > 0 && (
              <span className={styles.cartBadge}>{cartTotal}</span>
            )}
          </Link>

          {userName ? (
            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
              <Button className={styles.userButton} type="text">
                <Avatar src={userImage} size="small" />
                <span className={styles.userName}>{userName}</span>
                <i className="bi bi-chevron-down" />
              </Button>
            </Dropdown>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              <i className="bi bi-person" />
              <span>Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}