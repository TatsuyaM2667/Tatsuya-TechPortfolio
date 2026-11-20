import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Phase } from "./data";

const LIGHT_COLORS: Record<Phase, number> = {
  dusk: 0xffd2b8,
  twilight: 0xffb59a,
  night: 0xdfe8ff,
  dawn: 0xfff3df,
};

const PAGE_COUNT = 9;
const PAGE_WIDTH = 3.4;
const PAGE_HEIGHT = 4.6;
const DESK_Y = -2.25;

interface PetalState {
  mesh: THREE.Mesh;
  speed: number;
  sway: number;
  phase: number;
}

function createPaperTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 700;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#f4eee1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 1400; i += 1) {
      ctx.fillStyle = `rgba(120, 104, 82, ${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }

    ctx.strokeStyle = "rgba(178, 78, 78, 0.28)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.lineTo(64, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = "rgba(96, 124, 150, 0.18)";
    ctx.lineWidth = 1;
    for (let y = 70; y < canvas.height; y += 38) {
      ctx.beginPath();
      ctx.moveTo(84, y);
      ctx.lineTo(canvas.width - 32, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(38, 44, 52, 0.34)";
    ctx.lineWidth = 2.2;
    for (let row = 0; row < 11; row += 1) {
      const y = 88 + row * 38;
      const length = 120 + Math.random() * 260;
      ctx.beginPath();
      ctx.moveTo(90, y);
      ctx.lineTo(90 + length, y - 1 + Math.random() * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#3b2b24");
    gradient.addColorStop(1, "#251b17");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 90; i += 1) {
      const y = Math.random() * canvas.height;
      ctx.strokeStyle = `rgba(18, 11, 8, ${0.04 + Math.random() * 0.09})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(140, y + Math.sin(i) * 3, 360, y - Math.cos(i) * 4, canvas.width, y + Math.sin(i * 0.7) * 3);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createPageGeometry() {
  const geometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 10, 14);
  const position = geometry.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const curl = Math.sin((x / PAGE_WIDTH + 0.5) * Math.PI) * 0.035 + Math.sin(y * 2.4) * 0.006;
    position.setZ(i, curl);
  }

  geometry.translate(PAGE_WIDTH / 2, 0, 0);
  geometry.computeVertexNormals();
  return geometry;
}

function createPetalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.16);
  shape.bezierCurveTo(0.09, 0.1, 0.1, -0.06, 0, -0.16);
  shape.bezierCurveTo(-0.1, -0.06, -0.09, 0.1, 0, 0.16);
  return new THREE.ShapeGeometry(shape, 10);
}

function flipAngle(progress: number, index: number) {
  const start = 0.06 + index * 0.09;
  const end = start + 0.16;
  const t = THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return -Math.PI * eased;
}

export default function ThreePaperBook({ phase }: { phase: Phase }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialPhase = useRef(phase);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 5.4, 8.6);
    camera.lookAt(0, -1.6, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.05));
    const keyLight = new THREE.DirectionalLight(LIGHT_COLORS[initialPhase.current], 1.4);
    keyLight.position.set(3, 6, 5);
    lightRef.current = keyLight;
    scene.add(keyLight);

    const woodTexture = createWoodTexture();
    const deskGeometry = new THREE.PlaneGeometry(22, 16);
    const deskMaterial = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.95, metalness: 0 });
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.rotation.x = -Math.PI / 2;
    desk.position.y = DESK_Y;
    scene.add(desk);

    const shadowGeometry = new THREE.CircleGeometry(4.3, 48);
    const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2, depthWrite: false });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.set(1, 0.58, 1);
    shadow.position.y = DESK_Y + 0.01;
    scene.add(shadow);

    const paperTexture = createPaperTexture();
    const paperMaterial = new THREE.MeshStandardMaterial({
      map: paperTexture,
      side: THREE.DoubleSide,
      roughness: 0.96,
      metalness: 0,
      transparent: true,
      opacity: 0.9,
    });
    const pageGeometry = createPageGeometry();

    const book = new THREE.Group();
    book.position.set(0, DESK_Y + 0.12, 0);
    book.rotation.x = -Math.PI / 2 + 0.02;
    const rightPages: THREE.Mesh[] = [];
    const leftPages: THREE.Mesh[] = [];

    for (let i = 0; i < PAGE_COUNT; i += 1) {
      const depth = -0.05 + Math.sin(i * 1.3) * 0.025;
      const lift = 0.01 + i * 0.005;

      const right = new THREE.Mesh(pageGeometry, paperMaterial);
      right.position.set(0.12 + i * 0.004, depth, lift);
      rightPages.push(right);
      book.add(right);

      const left = new THREE.Mesh(pageGeometry, paperMaterial);
      left.position.set(-0.12 - i * 0.004, depth, lift);
      left.rotation.y = -Math.PI;
      leftPages.push(left);
      book.add(left);
    }
    scene.add(book);

    const petalGeometry = createPetalGeometry();
    const petalMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3bfc8,
      side: THREE.DoubleSide,
      roughness: 0.9,
      metalness: 0,
      transparent: true,
      opacity: 0.92,
    });
    const petals: PetalState[] = [];

    for (let i = 0; i < 64; i += 1) {
      const mesh = new THREE.Mesh(petalGeometry, petalMaterial);
      mesh.position.set((Math.random() - 0.5) * 9, 0.4 + Math.random() * 6, (Math.random() - 0.5) * 6);
      mesh.scale.setScalar(0.4 + Math.random() * 0.35);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      petals.push({
        mesh,
        speed: 0.006 + Math.random() * 0.012,
        sway: 0.0015 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
      });
      scene.add(mesh);
    }

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      const elapsed = clock.getElapsedTime();
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);

      rightPages.forEach((page, index) => {
        const angle = flipAngle(progress, index);
        const flutter = Math.sin(elapsed * 1.1 + index * 0.8) * 0.004 * (1 - Math.abs(angle) / Math.PI);
        page.rotation.y = angle + flutter;
        page.rotation.z = Math.sin(elapsed * 0.6 + index) * 0.003;
      });

      leftPages.forEach((page, index) => {
        page.rotation.y = -Math.PI + Math.sin(elapsed * 0.7 + index) * 0.003;
        page.rotation.z = Math.sin(elapsed * 0.5 + index * 0.7) * 0.002;
      });

      book.rotation.x = -Math.PI / 2 + 0.02 + Math.sin(elapsed * 0.18) * 0.002;
      book.rotation.z = Math.sin(elapsed * 0.12) * 0.008 + progress * 0.02;

      petals.forEach(({ mesh, speed, sway, phase: petalPhase }, index) => {
        mesh.position.y -= speed;
        if (mesh.position.y < DESK_Y + 0.06) {
          mesh.position.set((Math.random() - 0.5) * 9, 5.4 + Math.random() * 1.6, (Math.random() - 0.5) * 6);
        }
        mesh.position.x += Math.sin(elapsed * 0.8 + petalPhase) * sway;
        mesh.rotation.y += 0.003;
        mesh.rotation.z += 0.002 + index * 0.00001;
      });

      renderer.render(scene, camera);
      if (!reduced) frame = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      deskGeometry.dispose();
      deskMaterial.dispose();
      woodTexture.dispose();
      shadowGeometry.dispose();
      shadowMaterial.dispose();
      pageGeometry.dispose();
      paperMaterial.dispose();
      paperTexture.dispose();
      petalGeometry.dispose();
      petalMaterial.dispose();
      lightRef.current = null;
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    lightRef.current?.color.setHex(LIGHT_COLORS[phase]);
  }, [phase]);

  return <canvas className="three-field" ref={canvasRef} aria-hidden="true" />;
}
