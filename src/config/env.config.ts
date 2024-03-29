import cluster from 'node:cluster';

export const isMainCluster =
    process.env.NODE_APP_INSTANCE && Number.parseInt(process.env.NODE_APP_INSTANCE) === 0;
export const isMainProcess = cluster.isPrimary || isMainCluster;

export const isDev = process.env.NODE_ENV === 'development';
