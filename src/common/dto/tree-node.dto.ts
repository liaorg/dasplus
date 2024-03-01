/**
 * 树结点
 */
export class TreeNodeDto {
    /**
     * 权限id，唯一标示
     */
    key: string | number;
    /**
     * 节点显示的标题
     */
    title: string;
    /**
     * 是否允许选中
     */
    selectable?: boolean;
    /**
     * 是否禁用节点
     */
    disabled?: boolean;
    /**
     * 是否禁用复选框
     */
    disableCheckbox?: boolean;
    /**
     * 是否显示多选框
     */
    checkable?: boolean;
    /**
     * 是否可以拖拽
     */
    draggable?: boolean;
    /**
     * 是否是叶子节点。动态加载时有效
     */
    isLeaf?: boolean;
    /**
     * 子节点
     */
    children?: TreeNodeDto[];
}
