import { genCacheKey } from '@/common/helps';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { coverContent, hasCreditCard, hasIdentityCode, replacePos } from '@/common/utils';
import { hasIp, hasIpv4, hasIpv6 } from '@/common/utils/ip';
import { Injectable } from '@nestjs/common';
import { DesensitizationCfg, DesensitizationCfgDocument } from './schemas';

@Injectable()
export class DesensitizationService extends BaseService<DesensitizationCfg> {
    constructor(
        @InjectMongooseRepository(DesensitizationCfg.name)
        protected readonly repository: MongooseRepository<DesensitizationCfg>,
    ) {
        const cacheKey: string = genCacheKey('DesensitizationService');
        super(repository, cacheKey);
        // 缓存数据
        this.initCache();
    }

    // 获取脱敏配置
    findInfo() {
        // 启用的 公开的前缀 >0 公开的后缀 > 0
        const filter = { enable: true };
        return this.find({ filter, options: { sort: { _id: -1 } } });
    }
    /**
     * 内容脱敏
     */
    async desensitiveContent(data: string, conf: DesensitizationCfgDocument[]) {
        if (conf?.length && data) {
            let content = data;
            conf.forEach((item) => {
                // 启用的且公开的前缀 >0 或 公开的后缀 > 0
                if (item.enable && (item.mask_public_left > 0 || item.mask_public_right > 0)) {
                    // 其它特殊处
                    if (item.algorithm === 'ipv6_address') {
                        // IPV6地址
                        content = this.replaceAll({ content, search: hasIpv6, conf: item });
                    } else if (item.algorithm === 'ipv4_address') {
                        // IPV4地址
                        content = this.replaceAll({ content, search: hasIpv4, conf: item });
                    } else if (item.algorithm === 'ip_address') {
                        // IP地址
                        content = this.replaceAll({ content, search: hasIp, conf: item });
                    } else if (item.algorithm === 'identity_number') {
                        // 身份证号
                        content = this.replaceAll({ content, search: hasIdentityCode, conf: item });
                    } else if (item.algorithm === 'credit_card') {
                        // 银行卡号
                        content = this.replaceAll({ content, search: hasCreditCard, conf: item });
                    } else if (item.algorithm === false) {
                        try {
                            let regexp: RegExp;
                            if (item.name === '中文姓名') {
                                regexp = new RegExp(item.regex, 'gu');
                            } else {
                                regexp = new RegExp(item.regex, 'gi');
                            }
                            content = String(content).replace(regexp, (str) => {
                                return coverContent(
                                    str,
                                    item.mask_public_left,
                                    item.mask_public_right,
                                    item.maskchr,
                                );
                            });
                        } catch (error) {
                            return content;
                        }
                    }
                }
            });
            return content;
        }
        return data;
    }

    /**
     * 替换匹配到的所有
     * @param param
     * @returns
     */
    replaceAll(param: {
        content: string;
        search: (content: string) => any;
        replace?: string;
        conf?: DesensitizationCfgDocument;
    }) {
        let { content, search, replace, conf } = param;
        const has = search(content);
        if (has !== null && has?.index !== undefined) {
            replace =
                replace ||
                coverContent(has[0], conf.mask_public_left, conf.mask_public_right, conf.maskchr);
            content = replacePos(content, has.index, replace);
            return this.replaceAll({ content, search, replace });
        }
        return content;
    }
}
