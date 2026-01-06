// 추후 타 파일로 통합될 예정 (아닐 수도?)
/*
DB에 존재하는 Block 테이블로 차단에 관해서 누가 했는지, 누가 당했는지, 언제 했는지를 기록
이루어져야할 로직
1. 친구 관계 차단
2. 상호 관계 차단 -> 기본적으로 관련된 데이터들 안 보임. 그 외적으로도 막아야하나?
구현 방법
1. 쿼리문에 NOT IN 절을 사용하여 차단된 유저의 데이터를 제외하고 불러오기 -> 성능 이슈 발생 가능성 높음
2. 일단 DB에서 다 불러온 후, 서버에서 필터링 -> 서버 부하 발생 가능성 높음
3. Redis (대규모에서만)
고려사항
1. 쌍방향 차단인지, 단방향 차단인지
2. 차단 해제 기능의 유무 (일단은 없는걸로 앎)
3. 일단은 채팅 기능의 경우 1대1 상황만 잇는걸로 아는데 다대다 상황에서의 차단 후는 어떻게 되는가

--> 초기 개발이며 대규모 서비스가 아니므로 1번 방법 혹은 
    약간의 수정 버전 (LETT JOIN + IS NULL)이나 NOT EXISTS 등을 사용하여 구현 예정
--> block 테이블의 insert에 대해서만 다루는 api만 구현하고, prisma extensions를 사용해 차단된 유저는 안 보이게
*/

import { postUserBlock } from '../services/block.service.js';

export const handlePostUserBlock = async (req, res, next) => {
    const blockedUserId = req.body.targetUserId;
    const blockerUserId = req.body.id; // 세션이나 토큰에서 가져오는걸로 변경 필요

    if (blockerId.isNull || blockedId.isNull) {
        throw {
            status: 400,
            errorCode: "BLOCK_400",
            reason: "차단할 유저 정보가 올바르지 않습니다.",
            data: null,
        };
    }

    const result = await postUserBlock(blockerUserId, blockedUserId);
}