// vpkGraphvizManager.js
console.log('initialize vpkGraphvizManager.js');

(function () {
    const graphvizInstances = {};
    const contextMonitors = {};

    function renderGraph(containerId, dotData, nodeCount = 100, options = {}) {
        const { zoom = false, trackContext = false, onRenderEnd = null } = options;

        const wrapper = document.getElementById(containerId);
        if (!wrapper) {
            console.error(`renderGraph: container "${containerId}" not found`);
            return;
        }

        const height = `${Math.min(8000, Math.max(2000, nodeCount * 20))}pt`;

        // Clear any existing graphviz instance
        try {
            if (graphvizInstances[containerId]) {
                graphvizInstances[containerId].transition().remove();
            }
        } catch (e) {
            // No-op on first load
        }

        // // Clear and rebuild wrapper container
        // wrapper.innerHTML = `
        //     <div id="${containerId}-viz" style="width: 100%; height: 100%; text-align: center;"></div>
        // `;

        wrapper.innerHTML = '<div id="' + containerId + '-viz" style="width: 100%; height: 100%; text-align: center;"></div>';

        const graphvizEl = d3.select(`#${containerId}-viz`);

        const viz = graphvizEl
            .graphviz({ useWorker: false })
            .zoom(false) // we'll handle zoom externally
            .height(height)
            .renderDot(dotData)
            .on('end', () => {
                setTimeout(() => {
                    if (zoom) {
                        const svg = graphvizEl.select('svg');
                        const g = svg.select('g');

                        if (!svg.empty() && !g.empty()) {
                            svg.call(
                                d3
                                    .zoom()
                                    .scaleExtent([0.1, 10]) // min/max zoom
                                    .on('zoom', (event) => {
                                        g.attr('transform', event.transform);
                                    }),
                            );
                        } else {
                            console.warn(`Zoom setup failed — SVG or G not found inside #${containerId}-viz`);
                        }
                    }

                    if (typeof onRenderEnd === 'function') {
                        onRenderEnd();
                    }

                    // Optional: WebGL context monitor
                    if (trackContext && !contextMonitors[containerId]) {
                        const el = document.getElementById(`${containerId}-viz`);
                        if (el) {
                            el.addEventListener('webglcontextlost', function (e) {
                                console.warn(`🚨 WebGL context lost in ${containerId}-viz`, e);
                            });
                            contextMonitors[containerId] = true;
                        }
                    }
                }, 100); // Delay ensures SVG is mounted before zoom is applied
            });

        graphvizInstances[containerId] = viz;
    }

    function clearAllGraphs() {
        Object.keys(graphvizInstances).forEach((id) => {
            try {
                graphvizInstances[id].transition().remove();
            } catch (e) {
                console.warn(`clearAllGraphs: could not remove graphviz instance for ${id}`, e);
            }
        });
    }

    // Expose API globally
    window.graphvizManager = {
        renderGraph,
        clearAllGraphs,
    };
})();

//----------------------------------------------------------
console.log('loaded vpkGraphvizManager.js');
