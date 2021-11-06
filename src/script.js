import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { gsap } from 'gsap'
import { Interaction } from 'three.interaction/src/index.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// MANAGER
let sceneReady = false
const MANAGER = new THREE.LoadingManager(
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
        }, 500)

        window.setTimeout(() => 
        {
            sceneReady = true
        }, 2000)
    },
)

// DebugUI
// const debugGUI = new dat.GUI()

// CANVAS DOM
const canvas = document.querySelector(`.webgl`)

// SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color(`#f0f0f0`)

// LOADER
const gltfLoader = new GLTFLoader(MANAGER)
const textureLoader = new THREE.TextureLoader(MANAGER)
const fontLoader = new FontLoader(MANAGER)

// MANAGER OVERLAY
const overlayPlane = new THREE.PlaneBufferGeometry(2,2,1,1)
const overlayMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uAlpha: {value: 1}
    },
    transparent: true,
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.94, 0.94, 0.94, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayPlane, overlayMaterial)
scene.add(overlay)

// APECT RATIO / RESOLUTION
const resolution = {
    width: window.innerWidth,
    height: window.innerHeight
}

// CAMERA
const camera = new THREE.PerspectiveCamera(
    50,
    resolution.width / resolution.height,
    0.1,
    30
)
camera.position.x = 2.7
camera.position.y = 1.4
camera.position.z = -1.1
camera.lookAt(-.2, 0.5, 1.3)
// camera.position.x = -1.7
// camera.position.y = 0.9
// camera.position.z = 0.4
// camera.lookAt(-4, 0.9, 0.4)
scene.add(camera)

// const camera2 = new THREE.PerspectiveCamera(
//     50,
//     resolution.width / resolution.height,
//     0.1,
//     150
// )
// camera2.position.set(0, 15, 0)
// camera2.lookAt(0,0,0)
// scene.add(camera2)

// // CAMERA HELPER
// const cameraHelper = new THREE.CameraHelper(camera)
// scene.add(cameraHelper)

// // CAMERA PATH
// const pathCube1 = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(0.1,0.1,0.1),
//     new THREE.MeshBasicMaterial({color: `#00f`})
// )
// pathCube1.position.set(2.7, 1.4, -1.1)
// scene.add(pathCube1)

// const pathCube2 = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(0.1,0.1,0.1),
//     new THREE.MeshBasicMaterial({color: `#00f`})
// )
// pathCube2.position.set(3, 1.2, -0.1)
// scene.add(pathCube2)

// const pathCube3 = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(0.1,0.1,0.1),
//     new THREE.MeshBasicMaterial({color: `#00f`})
// )
// pathCube3.position.set(1.7, 1.1, 0.4)
// scene.add(pathCube3)

// const pathCube4 = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(0.1,0.1,0.1),
//     new THREE.MeshBasicMaterial({color: `#00f`})
// )
// pathCube4.position.set(-1.7, 0.9, 0.4)
// scene.add(pathCube4)

// const pathCubeTarget = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(0.1,0.1,0.1),
//     new THREE.MeshBasicMaterial({color: `#00f`})
// )
// pathCubeTarget.position.set(-4, 0.9, 0.4)
// scene.add(pathCubeTarget)

// const pathCubeTarget2 = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(0.1,0.1,0.1),
//     new THREE.MeshBasicMaterial({color: `#00f`})
// )
// pathCubeTarget2.position.set(-2.5, 0.7, 2)
// scene.add(pathCubeTarget2)

// const initalTarget = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(0.1,0.1,0.1),
//     new THREE.MeshBasicMaterial({color: `#00f`})
// )
// initalTarget.position.set(-.2, 0.5, 1.3)
// scene.add(initalTarget)

const pathConfig = {
    playhead: 0.0001
}

const path = new THREE.CubicBezierCurve3(
    new THREE.Vector3(2.7, 1.4, -1.1),
    new THREE.Vector3(3, 1.2, -0.1),
    new THREE.Vector3(1.7, 1.1, 0.4),
    new THREE.Vector3(-1.7, 0.9, 0.4)
)

const targetPath = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-.2, 0.5, 1.3),
    new THREE.Vector3(-2.5, 0.7, 2),
    new THREE.Vector3(-4, 0.9, 0.4),
    new THREE.Vector3(-4, 0.9, 0.4),
)

// const points = path.getPoints( 50 );
// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
// const curveObject = new THREE.Line( geometry, material );
// scene.add(curveObject)

// const points1 = targetPath.getPoints( 50 );
// const geometry1 = new THREE.BufferGeometry().setFromPoints( points1 );
// const material1 = new THREE.LineBasicMaterial( { color : 0xff0000 } );
// const curveObject1 = new THREE.Line( geometry1, material1 );
// scene.add(curveObject1)

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.compile(scene, camera)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.LinearToneMapping
renderer.setSize(resolution.width, resolution.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// THREE INTERACTION
const interaction = new Interaction(renderer, scene, camera)

// GROUP
const group = new THREE.Group()
scene.add(group)

const group1 = new THREE.Group()
scene.add(group1)

const group2 = new THREE.Group()
scene.add(group2)

const menuParent = new THREE.Group()
const menu1 = new THREE.Group()
const menu2 = new THREE.Group()
const menu1Child = new THREE.Group()
const menu2Child = new THREE.Group()
const menu1SubParent = new THREE.Group()
const menu2SubParent = new THREE.Group()
const buttonSubParent = new THREE.Group()
const button = new THREE.Group()
scene.add(menuParent)
menu1SubParent.add(menu1Child)
menu2SubParent.add(menu2Child)
menu1.add(menu1SubParent)
menu2.add(menu2SubParent)
buttonSubParent.add(button)
menuParent.add(menu1, menu2, buttonSubParent)
menu1.rotation.y = Math.PI * 0.1
menu1.position.x = -5
menu1.position.y =  0.5
menu1.position.z = 1.8
menu2.rotation.y = Math.PI * -0.1
menu2.position.x = -5
menu2.position.y =  0.5
menu2.position.z = -0.7
buttonSubParent.position.x = -3.3
buttonSubParent.position.y = 0.3
buttonSubParent.position.z = 0.5
menu1SubParent.scale.set(0,0,0)
menu2SubParent.scale.set(0,0,0)
button.scale.set(0,0,0)

// BOUNDING BOX OBJECT
const boundBoxMaterial = new THREE.MeshBasicMaterial({color: `#f00`, wireframe: true})
boundBoxMaterial.visible = false

const boundBox2Material = new THREE.MeshBasicMaterial({color: `#00f`, wireframe: true})
boundBox2Material.visible = false

const boundingBox = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1,1,1),
    boundBoxMaterial
)

const boundingBox1 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(2,2,2),
    boundBox2Material
)

const boundingBox2 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(2,2,2),
    boundBox2Material
)

const boundingBox3 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.5, 0.25, 0.5),
    boundBox2Material
)

menu1SubParent.add(boundingBox1)
menu2SubParent.add(boundingBox2)
button.add(boundingBox3)
boundingBox1.position.y = 0.5
boundingBox2.position.y = 0.5

boundingBox.scale.y = 2
boundingBox.scale.z = 0.5
boundingBox.scale.x = 2.3
boundingBox.rotation.y = Math.PI * 0.8
boundingBox.position.y = -1.8
boundingBox.position.x = 0
boundingBox.position.z = 7

// LOAD MODEL
const baked = textureLoader.load(`/texture/stall.jpg`)
baked.flipY = false
baked.encoding = THREE.sRGBEncoding

const bakedShadow = textureLoader.load(`/texture/shadow.png`)
bakedShadow.flipY = false
bakedShadow.encoding = THREE.sRGBEncoding

const bakedTexture = new THREE.MeshBasicMaterial()
bakedTexture.map = baked

const bakedShadowTexture = new THREE.MeshBasicMaterial()
bakedShadowTexture.map = bakedShadow
bakedShadowTexture.transparent = true

let foodStall, floor = null
gltfLoader.load(
    `/model/foodstall.glb`,
    (gltf) => 
    {
        foodStall = gltf.scene.children.find(child => child.name === `FoodStall`)
        foodStall.material = bakedTexture
        foodStall.position.y = -0.25
        foodStall.position.x = -0.5
        // scene.add(foodStall)
        group1.add(foodStall)

        floor = gltf.scene.children.find(child => child.name === `FoodStall001`)
        floor.material = bakedShadowTexture
        floor.position.y = -0.25
        floor.position.x = -0.5
        // scene.add(foodStall)
        group1.add(floor)
    }
)

gltfLoader.load(
    `/model/bottle.glb`,
    (gltf) => {menu1Child.add(gltf.scene)}
)

gltfLoader.load(
    `/model/hamburger.glb`,
    (gltf) => {menu2Child.add(gltf.scene)}
)

// LOAD TEXT
const uniforms = {
    uTime: {value: 0},
    uMouse: {value: new THREE.Vector2(0, 0)}
}
const vertexShader = `
    out vec2 vUv;

    void main()
    {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
    }
`
const text1Material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: `
        uniform float uTime;
        in vec2 vUv;
        
        void main()
        {
            vec2 st = 0.3 * vUv.xy;
            vec3 color = vec3(1.0, 
                        cos(st.x - st.y - uTime * 2.2) - 0.6, 
                        0.0);
            gl_FragColor = vec4(color, 1.0);
        }
    `
})
const text2Material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: `
        uniform float uTime;
        in vec2 vUv;
        
        void main()
        {
            vec2 st = vUv * 0.4 ;
            vec3 color = vec3(0.1, 
                        cos(sin( st.x - st.y - uTime * 2.2)) - 0.3, 
                        0.25);
            gl_FragColor = vec4(color, 1.0);
        }
    `
})
const text3Material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: `
        uniform float uTime;
        in vec2 vUv;
        
        void main()
        {
            vec2 st = vUv;
            vec3 color = vec3(cos(sin( st.x - st.y - uTime * 2.2)), 
                            0.8, 
                            0.0);
            gl_FragColor = vec4(color, 1.0);
        }
    `
})

let text = null
fontLoader.load(
    `fonts/Sigmar.json`,
    function(font)
    {
        const textGeometry = new TextGeometry(
            `Selamat Datang di`,
            {
                font: font,
                size: 1.5,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .003,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )

        textGeometry.center()
        text = new THREE.Mesh( textGeometry, text2Material)
        text.scale.set(0.2, 0.3, 0.2)
        text.rotation.y = Math.PI * 0.9
        text.position.y = 1.4
        text.position.x = -1.5
        text.position.z = 7
        group.add(text)
    }
)

let text1 = null
fontLoader.load(
    `fonts/Bebas.json`,
    function(font)
    {
        const textGeometry = new TextGeometry(
            `Kios Rizki`,
            {
                font: font,
                size: 4,
                height: .5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .003,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )

        textGeometry.center()
        text1 = new THREE.Mesh( textGeometry, text1Material)
        text1.scale.set(0.2, 0.3, 0.2)
        text1.rotation.y = Math.PI * 0.8
        text1.position.y = 0.4
        text1.position.x = 0
        text1.position.z = 4
        group1.add(text1)
    }
)

let text2 = null
fontLoader.load(
    `fonts/Sigmar.json`,
    function(font)
    {
        const textGeometry = new TextGeometry(
            `Lihat Menu`,
            {
                font: font,
                size: 1.1,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .003,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )

        textGeometry.center()
        textGeometry.computeBoundingBox()
        text2 = new THREE.Mesh( textGeometry, text2Material)
        text2.scale.set(0.2, 0.3, 0.2)
        text2.rotation.y = Math.PI * 0.8
        text2.position.y = -1.8
        text2.position.x = 0
        text2.position.z = 7
        group2.add(text2)
        group2.add(boundingBox)
    }
)

let text3 = null
fontLoader.load(
    `fonts/Sigmar.json`,
    function(font)
    {
        const textGeometry = new TextGeometry(
            `6K`,
            {
                font: font,
                size: 1.1,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .003,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )

        textGeometry.center()
        textGeometry.computeBoundingBox()
        text3 = new THREE.Mesh( textGeometry, text3Material)
        text3.scale.set(0.2, 0.3, 0.2)
        text3.rotation.y = Math.PI * 0.5
        text3.position.y = -0.5
        menu1SubParent.add(text3)
    }
)

let text4 = null
fontLoader.load(
    `fonts/Sigmar.json`,
    function(font)
    {
        const textGeometry = new TextGeometry(
            `10K`,
            {
                font: font,
                size: 1.1,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .003,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )

        textGeometry.center()
        textGeometry.computeBoundingBox()
        text4 = new THREE.Mesh( textGeometry, text3Material)
        text4.scale.set(0.2, 0.3, 0.2)
        text4.rotation.y = Math.PI * 0.5
        text4.position.y = -0.5
        menu2SubParent.add(text4)
    }
)

let text5 = null
fontLoader.load(
    `fonts/Sigmar.json`,
    function(font)
    {
        const textGeometry = new TextGeometry(
            `Bir Pletok`,
            {
                font: font,
                size: 1.1,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .003,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )

        textGeometry.center()
        textGeometry.computeBoundingBox()
        text5 = new THREE.Mesh( textGeometry, text2Material)
        text5.scale.set(0.2, 0.3, 0.2)
        text5.rotation.y = Math.PI * 0.5
        text5.position.y = 1.5
        text5.position.x = -0.5
        menu1SubParent.add(text5)
    }
)

let text6 = null
fontLoader.load(
    `fonts/Sigmar.json`,
    function(font)
    {
        const textGeometry = new TextGeometry(
            `Hamburger`,
            {
                font: font,
                size: 1.1,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .003,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )

        textGeometry.center()
        textGeometry.computeBoundingBox()
        text6 = new THREE.Mesh( textGeometry, text2Material)
        text6.scale.set(0.2, 0.3, 0.2)
        text6.rotation.y = Math.PI * 0.5
        text6.position.y = 1.5
        text6.position.x = -0.5
        menu2SubParent.add(text6)
    }
)

let text7 = null
fontLoader.load(
    `fonts/Bebas.json`,
    function(font)
    {
        const textGeometry = new TextGeometry(
            `Kembali`,
            {
                font: font,
                size: 1,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .003,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )

        textGeometry.center()
        textGeometry.computeBoundingBox()
        text7 = new THREE.Mesh( textGeometry, text1Material)
        text7.scale.set(0.1, 0.1, 0.1)
        text7.rotation.y = Math.PI * 0.5
        button.add(text7)
    }
)

// INTERACTION
// group2.cursor = `pointer`
group2.on(`mouseover`, evt => {
    gsap.to(group2.position, {
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        x: 0.5,
        y: 0.8,
        z: -1.5
    })
})

group2.on(`mouseout`, evt => {
    gsap.to(group2.position, {
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        x: 0,
        y: 0,
        z: 0
    })
})


let triggerAnimationMenu = false
const cameraToTarget = () =>
{
    gsap.to(
        pathConfig,
        {
            duration: 6,
            ease: "expo.out",
            playhead: 1
        }
    )
    window.setTimeout(() => {triggerAnimationMenu = true}, 1900)

    gsap.to(menu1SubParent.scale, {
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        x: 1,
        y: 1,
        z: 1,
        delay:1.9
    })


    gsap.to(menu2SubParent.scale, {
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        x: 1,
        y: 1,
        z: 1,
        delay:1.9
    })

    gsap.to(button.scale, {
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        x: 1,
        y: 1,
        z: 1,
        delay:1.9
    })
}

const backButton = () => 
{
    gsap.to(
        pathConfig,
        {
            duration: 6,
            ease: "expo.out",
            playhead: 0
        }
    )
    triggerAnimationMenu = false

    gsap.to(menu1SubParent.scale, {
        duration: 0.2,
        x: 0,
        y: 0,
        z: 0
    })

    gsap.to(menu2SubParent.scale, {
        duration: 0.2,
        x: 0,
        y: 0,
        z: 0
    })

    gsap.to(button.scale, {
        duration: 0.2,
        x: 0,
        y: 0,
        z: 0
    })
}

group2.on(`click`, evt => {cameraToTarget()})
group1.on(`click`, evt => {cameraToTarget()})
button.on(`click`, evt => {backButton()})

// RESIZE
window.addEventListener(`resize`, () => 
{
    // update res
    resolution.width = window.innerWidth
    resolution.height = window.innerHeight

    // update camera
    camera.aspect = resolution.width / resolution.height
    camera.updateProjectionMatrix()

    // // update camera2
    // camera2.aspect = resolution.width / resolution.height
    // camera2.updateProjectionMatrix()


    // update renderer
    renderer.setSize(resolution.width, resolution.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// MOUSE POINTER
let mouse = new THREE.Vector2()
window.addEventListener(`mousemove`, (evt)=>
{
    mouse.x = (evt.clientX / resolution.width) * 0.2 - 0.2
    mouse.y = -(evt.clientY / resolution.height) * 0.2 + 0.2

    uniforms.uMouse.value.x = mouse.x
    uniforms.uMouse.value.y = mouse.y
})

// UPDATE
const clock = new THREE.Clock()

function update()
{
    const elapsedTime = clock.getElapsedTime()
    uniforms.uTime.value = elapsedTime

    if(sceneReady !== false)
    {
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, (mouse.x * Math.PI) / 15, 0.1)
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, (mouse.y * Math.PI) / 20, 0.1)

        group1.rotation.y = THREE.MathUtils.lerp(group1.rotation.y, (mouse.x * Math.PI) / 10, 0.1)
        group1.rotation.x = THREE.MathUtils.lerp(group1.rotation.x, (mouse.y * Math.PI) / 15, 0.1)

        group2.rotation.y = THREE.MathUtils.lerp(group2.rotation.y, (mouse.x * Math.PI) / 10, 0.1)
        group2.rotation.x = THREE.MathUtils.lerp(group2.rotation.x, (mouse.y * Math.PI) / 15, 0.1)

        if(triggerAnimationMenu)
        {
            menu1SubParent.rotation.y = THREE.MathUtils.lerp(menu1SubParent.rotation.y, (mouse.x * Math.PI) / 10, 0.05)
            menu1SubParent.rotation.x = THREE.MathUtils.lerp(menu1SubParent.rotation.x, (mouse.y * Math.PI) / 10, 0.05)

            menu2SubParent.rotation.y = THREE.MathUtils.lerp(menu2SubParent.rotation.y, (mouse.x * Math.PI) / 10, 0.05)
            menu2SubParent.rotation.x = THREE.MathUtils.lerp(menu2SubParent.rotation.x, (mouse.y * Math.PI) / 10, 0.05)

            menu1Child.rotation.y = Math.cos(elapsedTime * 5 * 0.1)
            menu2Child.rotation.y = Math.cos(elapsedTime * 5 * 0.1)

            button.rotation.y = Math.sin(0.1 * elapsedTime * 15) / 4
            button.position.y = Math.cos(0.1 * elapsedTime * 25) / 20
        }

        const playhead = pathConfig.playhead

        const posTarget = targetPath.getPoint(playhead);
        camera.lookAt(posTarget.x,posTarget.y,posTarget.z)

        const pos = path.getPoint(playhead);
        camera.position.set(pos.x,pos.y,pos.z)
    }
    

    renderer.render(scene, camera)
    renderer.setSize(resolution.width, resolution.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    requestAnimationFrame(update)
}
update()

// DEBUG

// const debugFunction = 
// {
//     cameraToTarget: () => {cameraToTarget()},
//     backButton:  () => {backButton()}
// }

// debugGUI.add(debugFunction, `cameraToTarget`)
// debugGUI.add(debugFunction, `backButton`)

// debugGUI
// .add(pathConfig, `playhead`)
// .min(0.0001).max(1).step(0.0001)

// const cube2 = debugGUI.addFolder(`Cube 2`)
// cube2.open()

// cube2
// .add(pathCube2.position, `x`)
// .min(-10).max(10).step(0.001)

// cube2
// .add(pathCube2.position, `z`)
// .min(-10).max(10).step(0.001)

// const cube3 = debugGUI.addFolder(`Cube 3`)
// cube3.open()

// cube3
// .add(pathCube3.position, `x`)
// .min(-10).max(10).step(0.001)

// cube3
// .add(pathCube3.position, `z`)
// .min(-10).max(10).step(0.001)

// const cube4 = debugGUI.addFolder(`Cube 4`)
// cube4.open()

// cube4
// .add(pathCube4.position, `x`)
// .min(-10).max(10).step(0.001)

// cube4
// .add(pathCube4.position, `z`)
// .min(-10).max(10).step(0.001)

// const cubeTarget = debugGUI.addFolder(`Cube Target`)
// cubeTarget.open()

// cubeTarget
// .add(pathCubeTarget.position, `x`)
// .min(-10).max(10).step(0.001)

// cubeTarget
// .add(pathCubeTarget.position, `z`)
// .min(-10).max(10).step(0.001)

// const cubeTarget2 = debugGUI.addFolder(`Cube Target 2`)
// cubeTarget2.open()

// cubeTarget2
// .add(pathCubeTarget2.position, `x`)
// .min(-10).max(10).step(0.001)

// cubeTarget2
// .add(pathCubeTarget2.position, `z`)
// .min(-10).max(10).step(0.001)


// const buttonBack = debugGUI.addFolder(`buttonBack`)
// buttonBack.open()

// buttonBack
// .add(buttonSubParent.position, `x`)
// .min(-10).max(10).step(0.001)

// buttonBack
// .add(buttonSubParent.position, `z`)
// .min(-10).max(10).step(0.001)


