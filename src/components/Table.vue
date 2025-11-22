<template>
  <div>
    <el-table
      ref="dataTable"
      :data="dataSource.list || []"
      :height="tableHeight"
      :stripe="options.stripe"
      :border="options.border"
      header-row-class-name="table-header-row"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!-- selection column -->
      <el-table-column
        v-if="options.selectType && options.selectType == 'checkbox'"
        type="selection"
        :selectable="selectedHandler"
        width="50"
        align="center"
      />
      <!-- index column -->
      <el-table-column
        v-if="options.showIndex"
        label="序号"
        type="index"
        width="60"
        align="center"
      />
      <!-- data columns -->
      <template
        v-for="(column, index) in columns"
        :key="index"
      >
        <template v-if="column.scopedSlots">
          <el-table-column
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
          >
            <template #default="scope">
              <slot
                :name="column.scopedSlots"
                :index="scope.$index"
                :row="scope.row"
              />
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
            :fixed="column.fixed"
          />
        </template>
      </template>
    </el-table>
    <!-- pagination -->
    <div
      v-if="showPagination"
      class="pagination"
    >
      <el-pagination
        v-if="dataSource.totalCount"
        :current-page="dataSource.pageNum"
        background
        :total="dataSource.totalCount"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="dataSource.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        style="text-align: right"
        @size-change="handlePageSizeChange"
        @current-change="handlepageNumChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { PageData } from "@/api/_types";

const emit = defineEmits<{
  (e: "rowSelected", row: any): void;
  (e: "rowClick", row: any): void;
}>();

const props = defineProps({
  dataSource: {
    type: Object as PropType<PageData<any>>,
    default: () => ({
      list: [],
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      pageTotal: 0,
    }),
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object as PropType<{
      stripe?: boolean;
      border?: boolean;
      tableHeight?: number;
      selectType?: "checkbox" | "radio" | string;
      showIndex?: boolean;
    }>,
    default: () => ({}),
  },
  extHeight: {
    type: Number,
    default: 70,
  },
  columns: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  // fetch data function
  fetch: {
    type: Function as PropType<() => void>,
    default: undefined,
  },
  initFetch: {
    type: Boolean,
    default: true,
  },
  selected: {
    type: Function as PropType<(row: any, index: number) => boolean | void>,
    default: undefined,
  },
});

// calculate table height
const topHeight = 60 + 39 + 20 + 10 + 42 + 20 + 2;

const tableHeight = ref(
  props.options?.tableHeight ??
    (window.innerHeight - topHeight - (props.extHeight as number))
);

// init
const init = () => {
  if (props.initFetch) {
    props.fetch?.();
  }
};
init();

const dataTable = ref<any>();
// clear selection
const clearSelection = (): void => {
  dataTable.value?.clearSelection();
};

// set current row
const setCurrentRow = (rowKey: string, rowValue: any): void => {
  const row = props.dataSource.list.find((item: any) => {
    return item[rowKey] === rowValue;
  });
  dataTable.value?.setCurrentRow(row);
};

defineExpose({ setCurrentRow, clearSelection });

// row click
const handleRowClick = (row: any) => {
  emit("rowClick", row);
};

// selection change
const handleSelectionChange = (row: any) => {
  emit("rowSelected", row);
};

// page size change
const handlePageSizeChange = (size: number) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.dataSource.pageSize = size;
  // eslint-disable-next-line vue/no-mutating-props
  props.dataSource.pageNum = 1;
  props.fetch?.();
};
// page number change
const handlepageNumChange = (pageNum: number) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.dataSource.pageNum = pageNum;
  props.fetch?.();
};

// row selectable handler
const selectedHandler = (row: any, index: number) => {
  return props.selected?.(row, index) as any;
};
</script>

<style lang="scss">
.pagination {
  padding-top: 10px;
}
.el-pagination {
  justify-content: right;
}

.el-table__body tr.current-row > td.el-table__cell {
  background-color: #e6f0f9;
}

.el-table__body tr:hover > td.el-table__cell {
  background-color: #e6f0f9 !important;
}
</style>
