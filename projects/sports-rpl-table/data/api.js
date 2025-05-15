// Функция для запроса данных из GQL API Sports.ru
const fetchGQLData = async () => {
  // GQL запрос для получения данных турнирной таблицы РПЛ
  const query = `{statQueries{football{tournament(id:"rfpl",source:SPORTRADAR){id,currentSeason{id,rankingTeamStat(input:{attribute:[TOTAL_GOALS]}){items{team{id,name,teaser(last:0,next:1){current{id,links{sportsRu},currentMinute,home{score,team{name,logotype(input:{resize:ORIGINAL,ext:WEBP}){url}}},away{score,team{name,logotype(input:{resize:ORIGINAL,ext:WEBP}){url}}}}},lastFive{result,match{links{sportsRu}}},logotype(input:{resize:ORIGINAL,ext:WEBP}){url}},rank,value,stat{MatchesPlayed,MatchesWon,MatchesDrawn,MatchesLost,GoalsScored,GoalsConceded,CupRank,GroupPosition,GroupName,YellowCards,RedCards}}}}}}}`;

  try {
    const response = await fetch('https://www.sports.ru/gql/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-appname': 'vibe-coding'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return null;
  }
}; 