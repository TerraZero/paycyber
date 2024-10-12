<template lang="pug">
LayoutDemoPage(title="List")
  .admin-demo-list__filters
    DemoFormInput(v-model="search", label="Search", @input="onUpdate()")
    DemoFormSelect(v-model="type", label="Type", :options="typeOptions", @input="onUpdate()")
    ElButton(type="primary", icon="el-icon-plus", @click="onAdd()") 
    ElButton(type="danger", icon="el-icon-plus", @click="onStateTest()") 
  ElTable(:data="rows")
    ElTableColumn(prop="id", label="ID", width="50")
    ElTableColumn(prop="type", label="Type")
    ElTableColumn(prop="label", label="Label")
    ElTableColumn(prop="group", label="Group")
    ElTableColumn(label="Operations")
      template(slot-scope="{ row }")
        ElButton(type="primary", icon="el-icon-edit", circle, @click="onEdit(row)") 
        ElButton(type="danger", icon="el-icon-delete", circle, @click="onDelete(row)") 
        ElButton(type="danger", icon="el-icon-delete", circle, @click="onTest(row)") Test
  .admin-demo-list__pager
    ElPagination(layout="prev, pager, next", :page-size="pager", :total="total", @current-change="onPager", background)
</template>

<script>
import Socket from '~/custom/system/Socket';

const Request = require('~/custom/frontend/Request');

export default {
  mounted() {
    Socket.get((socket) => {
      socket.subscribe(this, 'test', (event) => {
        console.log('socket', event);
      }); 
    });
  },

  beforeDestroy() {
    Socket.get().unsubscribe(this);
  },

  data() {
    this.$nextTick(this.onUpdate);
    return {
      search: '',
      type: '',
      rows: null,
      pager: 10,
      page: 0,
      total: 0,
      typeOptions: {
        '': '',
        music: 'Music',
        image: 'Image',
      },
    };
  },
  methods: {

    async onUpdate() {
      const response = await Request.create('demo/list').GET({
        search: this.search,
        type: this.type,
        pager: this.pager,
        page: this.page,
      });

      this.rows = response.list;
      this.total = response.count;
    },

    onPager(current) {
      this.page = current - 1;
      this.onUpdate();
    },

    onAdd() {
      this.$router.push('/admin/demo/create');
    },

    onEdit(row) {
      this.$router.push('/admin/demo/' + row.id + '/edit');
    },

    async onDelete(row) {
      try {
        await this.$confirm(`Are you sure to delete "${row.label}" [${row.id}]?`, {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          confirmButtonClass: 'el-button--danger',
        });
        await Request.create('demo/delete').POST({
          id: row.id,
        });
        this.onUpdate();
      } catch (e) { }
    },

    async onTest(row) {
      const data = await Socket.get().request('test', { row });
      console.log(data);
    },

    async onStateTest() {
      const list = await Request.create('demo/state').POST({
        op: 'list',
      });
      console.log(list);
      const data = await Request.create('demo/state').POST({
        op: 'save',
        states: [
          {
            key: 'images',
            value: {
              images: [
                {
                  url: 'first.jpg',
                },
                {
                  url: 'second.jpg',
                },
              ],
            },
          }
        ],
      });
      console.log(data);
    },

  },
}
</script>
  
<style lang="sass">
.admin-demo-list

  &__filters
    display: flex
    gap: 1em
    margin-bottom: 1em

  &__pager
    display: flex
    justify-content: center
    padding: 1em 0
</style>