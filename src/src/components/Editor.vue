<template>
  <div class="container mb-5">
    <!--    Локации-->
    <div class="row mb-5">
      <!--Управление локациями-->
      <div class="col-3">
        <div class="row">
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

                <div class="float-end">
                  <button class="btn btn-success" type="button" @click="selectedNode=nodes[nodeIndex]">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>

                  <button class="btn btn-danger" type="button" @click="removeNode(nodeIndex)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mt-3">
            <label v-if="nodes.length===0">
              Импорт
              <input class="form-control"
                     type="file"
                     @change="importExportFile"
                     value="Импорт">
            </label>
            <button class="btn btn-info" type="button" @click="addNode(null)">
              <i class="fa-solid fa-plus"></i>
            </button>
            <template v-if="nodes.length>0">
              <button class="btn btn-success" type="button" @click="save()">
                <i class="fa-solid fa-save">Сохранить</i>
              </button>
              <button class="btn btn-success" type="button" @click="exportNodes()">
                <i class="fa-solid fa-save">Экспорт</i>
              </button>
            </template>
          </div>
        </div>
      </div>
      <!--      Граф-->
      <div class="col-4 border">
        <div id="graph"></div>
      </div>
      <!--      насройка локации-->
      <div class="col-5">
        <h2>Настройки локации</h2>
        <div class="row">
          <div class="col-12 mb-5" v-if="selectedNode!==null">
            <div class="row">
              <div class="col-12">
                <input type="text" class="form-control mb-1" v-model="selectedNode.data.name">
              </div>
              <div class="col-12">
                <textarea class="form-control w-100 bg-white text-body"
                          v-model="selectedNode.data.description"
                          placeholder="Описание локации"></textarea>
              </div>

              <!--              Связи-->
              <div class="row">
                <div class="col-12">
                  <h3>Связь локации</h3>
                  <ul class="list-group mb-3">
                    <li class="list-group-item" v-for="link in linksNodes.filter((item)=>{
                      return hasSelectedLink(item.id)
                    })" :key="link.id">
                      {{ link.name }}

                      <button class="btn btn-sm btn-danger float-end" @click="removeLink(link.id)">
                        <i class="fa fa-trash"></i>
                      </button>
                    </li>
                  </ul>

                  <select class="form-select mb-2" @change="addLink($event, null)">
                    <option value="">Выбрать</option>
                    <option v-for="link in linksNodes"
                            :value="link.id"
                            v-if="hasSelectedLink(link.id)===false && link.id !== selectedNode.id"
                            :key="link.id">{{ link.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!--              ресурсы-->
              <div class="col-12 mb-4 border-bottom pb-2">
                <h3>Ресурсы</h3>
                <div class="row" v-for="(resourceItems, resourceKey) in selectedNode.data.resource" :key="resourceKey">
                  <div class="col-12">
                    <h5 class="text-end">
                      {{ resourceKey }}
                      <i class="fa"
                         v-bind:class="{'fa-images': resourceKey==='images' , 'fa-file-audio': resourceKey==='audio', 'fa-video': resourceKey==='video'}"></i>
                    </h5>
                    <div class="row" v-for="(item, index) in resourceItems"
                         :key="resourceKey+' '+index">
                      <div class="col-8">
                        <input type="text"
                               class="form-control mb-2"
                               v-model="selectedNode.data.resource[resourceKey][index]">
                      </div>
                      <div class="col-4">
                        <button class="btn btn-danger btn-sm"
                                @click="selectedNode.data.resource[resourceKey].splice(index, 1)">
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    <button class="btn btn-success btn-sm d-block"
                            @click="selectedNode.data.resource[resourceKey].push('')">
                      <i class="fa fa-plus-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="col-12 mb-4 border-bottom pb-2">
                <h3>Монстры на локации</h3>
                <select class="form-control" multiple v-model="selectedNode.data.monsters">
                  <option value="">Нет монстров</option>
                  <option v-for="monster in monsters" :key="monster.key" :value="monster.key">
                    {{ monster.name }}
                  </option>
                </select>
              </div>
            </div>

            <button class="btn btn-success" type="button" @click="updateNode()">
              <i class="fa-solid fa-save"> Сохранить</i>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!--    Монстрятина-->
    <div class="row">
      <div class="col-12">
        <h2 class="d-inline-block">Монстры</h2>
        <button class="btn btn-success btn-sm" @click="addMonster(null)">
          <i class="fa fa-plus-circle"></i>
        </button>

        <div class="accordion" id="monsterAccordion">
          <div class="card" v-for="(monster, monsterIndex) in monsters" :key="monsterIndex">
            <div class="card-header" :id="'headingMonster'+monsterIndex">
              <h5 class="mb-0">
                <button class="btn btn-link" type="button" @click="showCollapse('collapseMonster'+monsterIndex)">
                  {{ monster.name }}
                </button>
              </h5>
            </div>

            <div :id="'collapseMonster'+monsterIndex" class="collapse">
              <div class="card-body">
                <div class="row">
                  <div class="col-3">
                    <label>
                      Ключ
                      <input class="form-control" type="text"
                             :value="monsters[monsterIndex].key = getStrHash(monsters[monsterIndex].name+monsters[monsterIndex].description+monsterIndex)"
                             readonly>
                    </label>
                  </div>
                  <div class="col-3">
                    <label>
                      Название
                      <input class="form-control" type="text" v-model="monsters[monsterIndex].name">
                    </label>
                  </div>
                  <div class="col-3">
                    <label>
                      Уровень
                      <input class="form-control" type="number" v-model="monsters[monsterIndex].level">
                    </label>
                  </div>
                  <div class="col-3">
                    <label>
                      Очков здоровья
                      <input class="form-control" type="number" v-model="monsters[monsterIndex].health">
                    </label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <h4>Описание</h4>
                    <textarea class="form-control" v-model="monsters[monsterIndex].description"></textarea>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <h4>Дроп</h4>
                    <select v-if="objects.length>0" class="form-control" multiple v-model="monsters[monsterIndex].drop">
                      <option value=""></option>
                      <option v-for="object in objects" :key="'drop'+object.key"
                              :value="object.key">
                        {{ object.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-6">
                    <h4>Предметы для убийства</h4>
                    <select v-if="objects.length>0" class="form-control" multiple
                            v-model="monsters[monsterIndex].killObjects">
                      <option value=""></option>
                      <option v-for="object in objects" :key="'killObjects'+object.key" :value="object.key">
                        {{ object.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!--    Предметы-->
    <div class="row">
      <div class="col-12">
        <h2 class="d-inline-block">Предметы</h2>
        <button class="btn btn-success btn-sm" @click="addObject(null)">
          <i class="fa fa-plus-circle"></i>
        </button>

        <div class="accordion" id="objectAccordion">
          <div class="card" v-for="(object, objectIndex) in objects" :key="objectIndex">
            <div class="card-header" :id="'headingObject'+objectIndex">
              <h5 class="mb-0">
                <button class="btn btn-link" type="button" @click="showCollapse('collapseObject'+objectIndex)">
                  {{ object.name }}
                </button>
              </h5>
            </div>

            <div :id="'collapseObject'+objectIndex" class="collapse">
              <div class="card-body">
                <label>
                  Ключ
                  <input class="form-control" type="text"
                         :value="objects[objectIndex].key = getStrHash(objects[objectIndex].name+objects[objectIndex].description+objectIndex)"
                         readonly>
                </label>
                <label>
                  Название
                  <input class="form-control" type="text" v-model="objects[objectIndex].name">
                </label>
                <label>
                  Описание
                  <textarea class="form-control" v-model="objects[objectIndex].description"></textarea>
                </label>

                <br>
                <br>
                <qr-code size="128" :text="objects[objectIndex].key+':'+objects[objectIndex].name"></qr-code>
              </div>
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
      monsters: [],
      objects: [],
      renderer: null,
      nodeTemplate: {
        id: 1,
        data: {
          name: 'item',
          description: '',
          resource: {
            images: [],
            audio: [],
            video: []
          },
          monsters: []
        }
      },
      monsterTemplate: {
        key: this.getStrHash('Название монстра'),
        name: 'Название монстра',
        level: 1,
        health: 100,
        description: '',
        drop: [],
        killObjects: []
      },
      objectTemplate: {
        key: this.getStrHash('Название предмета'),
        name: 'Название предмета',
        description: ''
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

    // setInterval(() => {
    //   this.save()
    // }, 5000)
    /* eslint-enable */
  },

  computed: {
    linksNodes () {
      let result = []
      this.nodes.map((node) => {
        result.push({
          id: node.id,
          name: node.data.name,
          description: node.data.description,
          resource: node.data.resource,
          monsters: node.data.monsters
        })
      })
      return result
    }
  },
  methods: {
    hasSelectedLink (linkId) {
      if (Array.isArray(this.selectedNode.links) && this.selectedNode.links.length > 0) {
        let selectedLinksIds = this.selectedNode.links.map((selectedLink) => {
          return Number(selectedLink.toId)
        })
        return selectedLinksIds.indexOf(linkId) !== -1 && linkId !== this.selectedNode.id
      }
      return false
    },
    showCollapse (id) {
      document.getElementById(id).classList.toggle('show')
    },
    getStrHash (s) {
      return s.split('').reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return Math.abs(a & a)
      }, 0)
    },
    /**
     * Добавить ноду графа
     * @param data
     */
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
    /**
     * Добавить связь между нодами
     * @param event
     */
    addLink (event) {
      if (
        this.selectedNode.id !== event.target.value &&
        this.graph.getLink(this.selectedNode.id, event.target.value) === null
      ) {
        this.graph.addLink(this.selectedNode.id, event.target.value)
      }
    },
    removeLink (linkId) {
      for (let selectedLinkIndex in this.selectedNode.links) {
        let selectedLink = this.selectedNode.links[selectedLinkIndex]
        console.log(selectedLinkIndex)
        if (Number(selectedLink.toId) === linkId) {
          this.selectedNode.links.splice(selectedLinkIndex, 1)
          this.graph.removeLink(selectedLink)
          break
        }
      }
    },
    /**
     * Обновить ноду
     */
    updateNode () {
      this.graph.addNode(this.selectedNode.id, this.selectedNode.data)
    },
    /**
     * Удалить ноду
     * @param nodeIndex
     */
    removeNode (nodeIndex) {
      this.graph.removeNode(this.nodes[nodeIndex].id)
      this.nodes.splice(nodeIndex, 1)
    },
    getSaveObject () {
      return {
        objects: this.objects,
        monsters: this.monsters,
        nodes: this.nodes
      }
    },
    /**
     * Сохранить граф в локальную память
     */
    save () {
      localStorage.setItem('nodes', JSON.stringify(this.getSaveObject()))
    },
    /**
     * Загрузить сохраненные данные
     */
    loadSaveNodes () {
      let saveObjects = localStorage.getItem('nodes')
      if (saveObjects) {
        try {
          saveObjects = JSON.parse(saveObjects)
          this.objects = (saveObjects.objects) ? saveObjects.objects : []
          this.monsters = (saveObjects.monsters) ? saveObjects.monsters : []
          this.importNodes(saveObjects.nodes)
        } catch (e) {
          console.error('Error load saved nodes', e)
        }
      }
    },
    /**
     * Очистить ноды
     */
    clear () {
      this.nodes = []
      this.graph.clear()
    },
    /**
     * Экспорт графа
     */
    exportNodes () {
      const link = document.createElement('a')
      const file = new Blob([JSON.stringify(this.getSaveObject())], {type: 'text/plain'})
      link.href = URL.createObjectURL(file)
      link.download = 'graphNodes.txt'
      link.click()
      URL.revokeObjectURL(link.href)
    },
    /**
     * Импорт нод графа
     * @param nodes
     */
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
            if (this.graph.getLink(link.fromId, link.toId) === null) {
              this.graph.addLink(link.fromId, link.toId)
            }
          })
        }
      })
    },
    /**
     * Импорт файла
     * @param event
     */
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
    },
    /**
     * Добавить монстра
     * @param data
     */
    addMonster (data = null) {
      if (data === null) {
        data = JSON.parse(JSON.stringify(this.monsterTemplate))
      }
      this.monsters.push(data)
    },
    /**
     * Добавить предмет
     * @param data
     */
    addObject (data = null) {
      if (data === null) {
        data = JSON.parse(JSON.stringify(this.objectTemplate))
      }
      this.objects.push(data)

      // Добавить генерирование QR кодов
      // https://www.npmjs.com/package/qrcode
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
