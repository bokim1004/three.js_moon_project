import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {EXRLoader} from "three/addons";

/**
 * Debug
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const moonTexture = textureLoader.load('./textures/moon_texture.jpeg')


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xFAFAD2, 1)
scene.add(ambientLight)



/**
 * Environment map
 */
const rgbeLoader = new EXRLoader()
rgbeLoader.load('./textures/environmentMap/sky.exr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Objects
 */

// 달의 재질 생성 (MeshStandardMaterial 사용)
const material = new THREE.MeshStandardMaterial({
    map: moonTexture, // 텍스처를 재질에 적용
    roughness: 0.7,    // 표면의 거칠기 조절 (1에 가까울수록 거친 표면)
    metalness: 0.0,    // 금속성 정도 (달 표면은 비금속)
});


// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64), material
)
sphere.position.x = 0;
sphere.position.y = 1;

scene.add(sphere)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime


    sphere.rotation.x = - 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()