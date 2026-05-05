import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Wireframe icosahedron + particle field.
 * When `fullscreen` prop is true, geometry is scaled up and opacity slightly reduced
 * so it works as an ambient page-wide background.
 */
const ThreeScene = ({ fullscreen = false }) => {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const matsRef = useRef({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, fullscreen ? 7 : 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const initialColor = theme === "dark" ? 0xf5f5f4 : 0x0a0a0a;

    const radius = fullscreen ? 2.6 : 1.85;
    const wireOpacity = fullscreen ? 0.42 : 0.7;
    const innerOpacity = fullscreen ? 0.025 : 0.04;
    const particleOpacity = fullscreen ? 0.36 : 0.55;
    const particleCount = fullscreen ? 900 : 500;
    const particleSpread = fullscreen ? [30, 20, 18] : [14, 10, 10];

    const geo = new THREE.IcosahedronGeometry(radius, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: initialColor,
      wireframe: true,
      transparent: true,
      opacity: wireOpacity,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const innerGeo = new THREE.IcosahedronGeometry(radius * 0.6, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: initialColor,
      transparent: true,
      opacity: innerOpacity,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * particleSpread[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * particleSpread[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * particleSpread[2] - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: initialColor,
      size: fullscreen ? 0.024 : 0.022,
      sizeAttenuation: true,
      transparent: true,
      opacity: particleOpacity,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    matsRef.current = { mat, innerMat, pMat };

    const pointer = { x: 0, y: 0 };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onPointer);

    // Subtle scroll parallax for fullscreen mode — makes the bg feel alive
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    if (fullscreen) window.addEventListener("scroll", onScroll, { passive: true });

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      const scrollFactor = fullscreen ? scrollY * 0.0006 : 0;
      mesh.rotation.x = t * 0.14 + pointer.y * 0.25 + scrollFactor;
      mesh.rotation.y = t * 0.18 + pointer.x * 0.35 + scrollFactor * 0.8;
      inner.rotation.x = -t * 0.1;
      inner.rotation.y = -t * 0.13;
      points.rotation.y = t * 0.018 + scrollFactor * 0.4;
      points.rotation.x = pointer.y * 0.04;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onPointer);
      window.removeEventListener("resize", onResize);
      if (fullscreen) window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      geo.dispose(); mat.dispose();
      innerGeo.dispose(); innerMat.dispose();
      pGeo.dispose(); pMat.dispose();
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen]);

  useEffect(() => {
    const color = theme === "dark" ? 0xf5f5f4 : 0x0a0a0a;
    const m = matsRef.current;
    if (m.mat) m.mat.color.setHex(color);
    if (m.innerMat) m.innerMat.color.setHex(color);
    if (m.pMat) m.pMat.color.setHex(color);
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default ThreeScene;
