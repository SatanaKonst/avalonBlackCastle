<template>
  <div class="container">
    <div class="row">
      <div class="col-8 border">
        <div id="graph"></div>
      </div>
      <div class="col-4">
        <h1>Меню управления</h1>
        <button class="btn btn-info mb-3" type="button" @click="addNode(null)">Добавить локацию</button>
        <div class="row">
          <div class="col-12 mb-5" v-if="selectedNode!==null">
            <h2>Настройки локации</h2>

            <div class="row">
              <div class="col-12">
                <input type="text" class="form-control mb-1" v-model="selectedNode.data.name">
              </div>
              <div class="col-12">
                <textarea class="w-100 bg-white text-body" v-model="selectedNode.data.description"></textarea>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <h3>Связь</h3>
                <select class="form-control mb-2" multiple @change="addLink($event, null)">
                  <option v-for="link in linksNodes"
                          :value="link.id"
                          v-if="link.id!==selectedNode.id"
                          :key="link.id">{{ link.name }}
                  </option>
                </select>
              </div>
            </div>
            <button class="btn btn-success" type="button" @click="updateNode()">
              <i class="fa-solid fa-save"> Сохранить</i>
            </button>
          </div>

          <div class="col-12">
            <h2 class="d-inline">Локации</h2>
            <button class="btn btn-sm btn-danger" v-if="nodes.length>0" @click="clear">
              <i class="fa-solid fa-trash"></i>
            </button>
            <ul class="list-group mt-3">
              <li class="list-group-item"
                  v-if="nodes && nodes.length>0"
                  v-for="(node,nodeIndex) in nodes"
                  :key="nodeIndex">
                {{ node.data.name }}
                <button class="btn btn-success float-end" type="button" @click="selectedNode=nodes[nodeIndex]">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button class="btn btn-danger float-end" type="button" @click="removeNode(nodeIndex)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </li>
            </ul>
          </div>

          <div class="col-12 mt-3">
            <label v-if="nodes.length===0">
              Импорт
              <input class="btn btn-info"
                     type="file"
                     @change="importExportFile"
                     value="Импорт">
            </label>
            <div v-if="nodes.length>0">
              <button class="btn btn-success" type="button" @click="save()">
                <i class="fa-solid fa-save">Сохранить граф</i>
              </button>
              <button class="btn btn-success" type="button" @click="exportNodes()">
                <i class="fa-solid fa-save">Экспорт</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Editor',
  data () {
    return {
      graph: null,
      view: null,
      nodes: [],
      renderer: null,
      nodeTemplate: {
        id: 1,
        data: {
          name: 'item'
        }
      },
      selectedNode: null
    }
  },
  created () {
    /* eslint-disable */
    let link = document.createElement("link");
    link.href = "/static/fontawesome-6.4.0/css/all.css";
    link.type = "text/css";
    link.rel = "stylesheet";

    document.getElementsByTagName("head")[0].appendChild(link);

    this.graph = Viva.Graph.graph();
    this.view = Viva.Graph.View;

    /* eslint-enable */
  },
  mounted () {
    /* eslint-disable */
    let graphics = this.view.svgGraphics()
    graphics.node(function (node) {
      // The function is called every time renderer needs a ui to display node
      return Viva.Graph.svg('text')
        .attr('width', 24)
        .attr('height', 24)
        .text(node.data.name) // node.data holds custom object passed to graph.addNode();
    })
      .placeNode(function (nodeUI, pos) {
        // Shift image to let links go to the center:
        nodeUI.attr('x', pos.x - 12).attr('y', pos.y - 12)
      })

    // specify where it should be rendered:
    this.renderer = this.view.renderer(this.graph, {
      interactive: 'nodes',
      container: document.getElementById('graph'),
      graphics: graphics
    })

    this.renderer.run()

    this.loadSaveNodes()

    /* eslint-enable */
  },

  computed: {
    linksNodes () {
      let result = []
      this.nodes.map((node) => {
        result.push({
          id: node.id,
          name: node.data.name,
          description: '',
          resource: {
            images: [],
            audio: [],
            video: []
          }
        })
      })
      return result
    }
  },
  methods: {
    addNode (data = null) {
      if (data === null) {
        this.nodeTemplate.id++
        this.nodeTemplate.name = 'item ' + this.nodeTemplate.id
        data = JSON.parse(JSON.stringify(this.nodeTemplate))
      } else {
        this.nodeTemplate.id = data.id
      }
      let newNode = this.graph.addNode(data.id, data.data)
      this.nodes.push(newNode)
    },
    addLink (event) {
      if (this.selectedNode.id !== event.target.value) {
        this.graph.addLink(this.selectedNode.id, event.target.value)
      }
    },
    updateNode () {
      this.graph.addNode(this.selectedNode.id, this.selectedNode.data)
    },
    removeNode (nodeIndex) {
      this.graph.removeNode(this.nodes[nodeIndex].id)
      this.nodes.splice(nodeIndex, 1)
    },
    save () {
      localStorage.setItem('nodes', JSON.stringify(this.nodes))
    },
    loadSaveNodes () {
      let saveNodes = localStorage.getItem('nodes')
      if (saveNodes) {
        try {
          saveNodes = JSON.parse(saveNodes)
          this.importNodes(saveNodes)
        } catch (e) {
          console.error('Error load saved nodes', e)
        }
      }
    },
    clear () {
      this.nodes = []
      this.graph.clear()
    },
    exportNodes () {
      const link = document.createElement('a')
      const file = new Blob([JSON.stringify(this.nodes)], {type: 'text/plain'})
      link.href = URL.createObjectURL(file)
      link.download = 'graphNodes.txt'
      link.click()
      URL.revokeObjectURL(link.href)
    },
    importNodes (nodes) {
      /**
       * add Nodes
       */
      nodes.map((item) => {
        this.addNode(item)
      })

      /**
       * add Links Nodes
       */
      nodes.map((item) => {
        if (item.links && Array.isArray(item.links)) {
          item.links.map((link) => {
            this.graph.addLink(link.fromId, link.toId)
          })
        }
      })
    },
    importExportFile (event) {
      let file = event.target.files[0]
      let fr = new FileReader()
      fr.onload = () => {
        try {
          let tmp = JSON.parse(fr.result)
          this.importNodes(tmp)
        } catch (e) {
          console.error('error parse import file', e)
          this.nodes = []
        }
      }

      fr.readAsText(file)
    }

  }
}
</script>

<style>
#graph {
  width: 100%;
  height: 100vh;
}

#graph svg {
  width: inherit;
  height: inherit;
}
</style>
