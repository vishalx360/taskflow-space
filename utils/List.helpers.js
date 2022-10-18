import faker from "faker";
import { LexoRank } from "lexorank";

let currentRank = LexoRank.min();

export const defaultItems = (status, board) => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      id: `${i}-id-${board}-`,
      rank: currentRank.toString(),
      title: `Item ${i} of ${status}`,
      description: faker.lorem.sentences(),
      status,
      board,
    });
    currentRank = currentRank.genNext();
  }
  return data.sort(sortByLexoRankAsc);
};

export function sortByLexoRankAsc(a, b) {
  if (!a.rank && b.rank) {
    return -1;
  }
  if (a.rank && !b.rank) {
    return 1;
  }

  if (!a.rank || !b.rank) {
    return 0;
  }

  return a.rank.localeCompare(b.rank);
}

export function createSortablePayloadByIndex(items, event) {
  const { active, over } = event;
  const oldIndex = items.findIndex((x) => x.id === active.id);
  const newIndex = items.findIndex((x) => x.id === over?.id);
  let input;
  const entity = items[oldIndex];
  if (newIndex === 0) {
    const nextEntity = items[newIndex];
    input = { prevEntity: undefined, entity: entity, nextEntity: nextEntity };
  } else if (newIndex === items.length - 1) {
    const prevEntity = items[newIndex];
    input = { prevEntity: prevEntity, entity: entity, nextEntity: undefined };
  } else {
    const prevEntity = items[newIndex];
    const offset = oldIndex > newIndex ? -1 : 1;
    const nextEntity = items[newIndex + offset];
    input = { prevEntity: prevEntity, entity: entity, nextEntity: nextEntity };
  }

  return input;
}

export function getBetweenRankAsc(payload) {
  const { prevEntity, entity, nextEntity } = payload;
  let newLexoRank;
  if (!prevEntity && !!nextEntity) {
    newLexoRank = LexoRank.parse(nextEntity.rank).genPrev();
  } else if (!nextEntity && !!prevEntity) {
    newLexoRank = LexoRank.parse(prevEntity.rank).genNext();
  } else if (!!prevEntity && !!nextEntity) {
    newLexoRank = LexoRank.parse(nextEntity.rank).between(
      LexoRank.parse(prevEntity.rank)
    );
  } else {
    newLexoRank = LexoRank.parse(entity.rank).genNext();
  }

  return newLexoRank;
}
