// Use a window.onload function to ensure the DOM is ready
window.onload = function() {
    try {
        // Get the loading overlay and canvas elements
        const loadingOverlay = document.getElementById('loading-overlay');
        const canvas = document.getElementById('three-canvas');

        // --- Three.js Setup ---
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.z = 10;
        camera.position.y = 5;
        camera.rotation.x = -Math.PI / 8;
        scene.add(camera);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x0a0a0a, 1);
        scene.fog = new THREE.Fog(0x0a0a0a, 1, 200);

        // --- Glowing Grid with Waves ---
        const gridSize = 200;
        const gridDivisions = 200;
        const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
        gridGeometry.rotateX(-Math.PI / 2);

        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });

        const animatedGrid = new THREE.Mesh(gridGeometry, gridMaterial);
        animatedGrid.position.y = -1; // Position the grid slightly below the scene
        scene.add(animatedGrid);

        // Store initial vertex positions for the wave effect
        const initialPositions = animatedGrid.geometry.attributes.position.array.slice();
        const positions = animatedGrid.geometry.attributes.position;
        const center = new THREE.Vector3(0, 0, 0);

        // --- Floating Shapes ---
        const shapes = [];
        const numShapes = 50;

        const shapeGeometry = new THREE.IcosahedronGeometry(1.5, 0);
        const shapeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3,
            wireframe: true,
        });

        for (let i = 0; i < numShapes; i++) {
            const shape = new THREE.Mesh(shapeGeometry, shapeMaterial.clone());
            shape.position.x = (Math.random() - 0.5) * 150;
            shape.position.y = Math.random() * 50 + 10;
            shape.position.z = (Math.random() - 0.5) * 150;
            shape.rotation.x = Math.random() * Math.PI;
            shape.rotation.y = Math.random() * Math.PI;
            shape.rotation.z = Math.random() * Math.PI;
            shape.rotationSpeed = new THREE.Vector3(
                Math.random() * 0.005,
                Math.random() * 0.005,
                Math.random() * 0.005
            );
            shapes.push(shape);
            scene.add(shape);
        }

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Animate the circular grid waves
            for (let i = 0; i < positions.count; i++) {
                const vertex = new THREE.Vector3().fromBufferAttribute(positions, i);
                const initialY = initialPositions[i * 3 + 1];

                // Calculate the distance from the center (0,0,0)
                const distance = vertex.distanceTo(center);

                // Use the distance and elapsed time to create a circular ripple
                const waveHeight = Math.sin(distance * 0.8 - elapsedTime * 1.0) * 0.5;
                positions.setY(i, initialY + waveHeight);
            }
            positions.needsUpdate = true;

            // Auto-move the camera to create a dynamic feel
            camera.position.x = Math.sin(elapsedTime * 0.2) * 15;
            camera.position.z = Math.cos(elapsedTime * 0.2) * 15;
            camera.position.y = 5 + Math.sin(elapsedTime * 0.5) * 2;
            camera.lookAt(scene.position);

            // Rotate the shapes
            shapes.forEach(shape => {
                shape.rotation.x += shape.rotationSpeed.x;
                shape.rotation.y += shape.rotationSpeed.y;
                shape.rotation.z += shape.rotationSpeed.z;
            });

            renderer.render(scene, camera);
        };
        
        // Hide the loading overlay after a short delay for a smooth fade
        setTimeout(() => {
            loadingOverlay.classList.add('fade-out');
            // In case the transition doesn't work, we'll ensure it's removed after a second
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 1000);
        }, 500); // 500ms delay to let the animation start

        // Start the animation loop
        animate();
        
        // Handle window resizing
        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // --- Interactive Navigation ---
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-menu');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
        }

        // --- Smooth Scrolling for Navigation Links ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // --- Form Submission Handler ---
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const name = contactForm.querySelector('input[type="text"]').value;
                const email = contactForm.querySelector('input[type="email"]').value;
                const message = contactForm.querySelector('textarea').value;
                
                // Show success message (you can integrate with your backend here)
                alert(`Thank you ${name}! Your message has been received. We'll get back to you soon.`);
                
                // Reset form
                contactForm.reset();
            });
        }

        // --- Enhanced Hover Effects for Platform Logos ---
        const platformLogos = document.querySelectorAll('.platform-logo');
        platformLogos.forEach(logo => {
            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'scale(1.1) translateY(-5px)';
                logo.style.filter = 'drop-shadow(0 8px 12px rgba(0, 255, 255, 0.3))';
            });
            
            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'scale(1) translateY(0)';
                logo.style.filter = 'drop-shadow(0 4px 6px rgba(0, 255, 255, 0.1))';
            });
        });

        // --- Intersection Observer for Animations ---
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections for scroll animations
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // --- Enhanced Card Interactions ---
        const cyberCards = document.querySelectorAll('.cyber-card');
        cyberCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02) perspective(1000px)';
                card.style.boxShadow = '0 15px 30px rgba(0, 255, 255, 0.2), 0 0 50px rgba(255, 0, 255, 0.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1) perspective(1000px)';
                card.style.boxShadow = 'none';
            });
        });

        // --- Particle System Enhancement ---
        const createParticles = () => {
            const particleCount = 100;
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 200;
                positions[i * 3 + 1] = Math.random() * 100;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

                colors[i * 3] = Math.random();
                colors[i * 3 + 1] = Math.random();
                colors[i * 3 + 2] = 1;
            }

            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.6
            });

            const particleSystem = new THREE.Points(particles, particleMaterial);
            scene.add(particleSystem);

            return { system: particleSystem, positions: positions };
        };

        const particleSystem = createParticles();

        // Enhanced animation loop with particle movement
        const enhancedAnimate = () => {
            requestAnimationFrame(enhancedAnimate);

            const elapsedTime = clock.getElapsedTime();

            // Animate particles
            const positions = particleSystem.positions;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsedTime + i) * 0.01;
                if (positions[i + 1] > 100) {
                    positions[i + 1] = 0;
                }
            }
            particleSystem.system.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

    } catch (e) {
        // If there's an error in the script, this will log it to the console
        console.error("An error occurred during Three.js initialization:", e);
        // Optionally, you can also display an error message on the page
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = 'Error loading animation. Please try refreshing the page or try a different browser.';
        }
    }
};