
var __cov_JLP9iyFxRw1XEDdxQfxsyA = (Function('return this'))();
if (!__cov_JLP9iyFxRw1XEDdxQfxsyA.__coverage__) { __cov_JLP9iyFxRw1XEDdxQfxsyA.__coverage__ = {}; }
__cov_JLP9iyFxRw1XEDdxQfxsyA = __cov_JLP9iyFxRw1XEDdxQfxsyA.__coverage__;
if (!(__cov_JLP9iyFxRw1XEDdxQfxsyA['app/model/PersonRepository.js'])) {
   __cov_JLP9iyFxRw1XEDdxQfxsyA['app/model/PersonRepository.js'] = {"path":"app/model/PersonRepository.js","s":{"1":0},"b":{},"f":{},"fnMap":{},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":5,"column":48}}},"branchMap":{}};
}
__cov_JLP9iyFxRw1XEDdxQfxsyA = __cov_JLP9iyFxRw1XEDdxQfxsyA['app/model/PersonRepository.js'];
__cov_JLP9iyFxRw1XEDdxQfxsyA.s['1']++;var async=require('async'),Person=require('./Person'),config=require('../config/config'),neo4j=require('neo4j'),db=new neo4j.GraphDatabase(config.db.url);
