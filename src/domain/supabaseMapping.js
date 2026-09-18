// Teams created locally get a generated id like "team-1788229040114-ohqwpv",
// which Postgres rejects for a uuid column with 22P02. Only teams that
// round-tripped through the cloud have real UUIDs. Any caller writing
// team_id must pass it through this first -- the alternative is a sync
// error the bowler can do nothing about.
export function validTeamId(id) {
  return (typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) ? id : null;
}

// team_id is validated defensively here even though shots never currently
// use the form.teamId||sessionLeague fallback that caused this exact bug
// in matches and lane_patterns — this same bug pattern has now shown up
// twice, so trusting every caller forever isn't a great bet.
export function shotToSupabaseRow(shot,userId,leagueIdsMap){
  const teamId=validTeamId(shot.teamId);
  return{
    id:shot.id,
    user_id:userId,
    team_id:teamId,
    league_id:leagueIdsMap[shot.league]||null,
    // Null for a shot the bowler logged themselves; the source import's
    // id when it arrived from someone else's scorecard photo.
    imported_from:shot.importedFrom||null,
    // A no-tap strike: nine down on the first ball, counted as a strike
    // in a 9-pin no-tap league. Stored as a flag beside the real leave
    // rather than as result "Strike", so strike statistics stay clean
    // while carry statistics still see how the ball drove.
    no_tap:shot.noTap===true?true:null,
    // The league by NAME as well as by id.
    //
    // Practice, open bowling and tournaments bowl under container
    // leagues that are not rows in `leagues`, so league_id is null for
    // all of them. The shots uniqueness index coalesces null to a fixed
    // uuid, which made a practice shot, an open-bowling shot and a
    // tournament shot on the same date/game/frame the SAME ROW -- the
    // second one rejected with 23505 and never reaching the cloud.
    //
    // This is what the index widens on. For a real league it duplicates
    // what league_id already says, harmlessly; for a container it is the
    // only thing that distinguishes them.
    league_name:shot.league||"",
    bowler_name:shot.bowler||"",
    date:shot.date,
    game:parseInt(shot.game)||1,
    frame:parseInt(shot.frame)||1,
    ball_num:shot.ballNum??null,
    lane:shot.lane||"",
    ball:shot.ball||"",
    surface:shot.surface||"",
    ball_speed:shot.ballSpeed===""||shot.ballSpeed==null?null:Number(shot.ballSpeed),
    heel_number:shot.heelNumber||null,
    rev_rate:shot.revRate===""||shot.revRate==null?null:Number(shot.revRate),
    axis_rotation:shot.axisRotation===""||shot.axisRotation==null?null:Number(shot.axisRotation),
    axis_tilt:shot.axisTilt===""||shot.axisTilt==null?null:Number(shot.axisTilt),
    sole_number:shot.soleNumber||null,
    actual_arrows:shot.actualArrows===""||shot.actualArrows==null?null:Number(shot.actualArrows),
    starting_board:shot.startingBoard||"",
    // Measured breakpoint. Board and how far down the lane it turned.
    breakpoint_board:shot.breakpointBoard||"",
    target_arrows:shot.targetArrows||"",
    result:shot.result||"",
    other_leave:shot.otherLeave||[],
    spare_made:shot.spareMade||"",
    strike_description:shot.strikeDescription||"",
    release:shot.release||"",
    miss:shot.miss||[],
    ball_change_reason:shot.ballChangeReason||[],
    pin_count:shot.pinCount!=null?String(shot.pinCount):"",
    notes:shot.notes||"",
    display_result:shot._displayResult||shot.result||"",
    display_leave:shot._displayLeave||shot.otherLeave||[],
  };
}

export function shotFromSupabaseRow(row,leagueNameById){
  return{
    id:row.id,
    bowler:row.bowler_name||"",
    teamId:row.team_id||"",
    // league_id first, then the stored name.
    //
    // A container league has no id, so resolving by id alone gave "" and
    // the shot came back with no league at all -- orphaned from every
    // stat on any device that loaded it from the cloud.
    league:leagueNameById[row.league_id]||row.league_name||"",
    date:row.date,
    importedFrom:row.imported_from||null,

    noTap:row.no_tap===true?true:undefined,
    game:String(row.game),
    frame:String(row.frame),
    ballNum:row.ball_num,
    lane:row.lane||"",
    ball:row.ball||"",
    surface:row.surface||"",
    ballSpeed:row.ball_speed==null?"":String(row.ball_speed),
    heelNumber:row.heel_number||"",
    revRate:row.rev_rate==null?"":String(row.rev_rate),
    axisRotation:row.axis_rotation==null?"":String(row.axis_rotation),
    axisTilt:row.axis_tilt==null?"":String(row.axis_tilt),
    soleNumber:row.sole_number||"",
    actualArrows:row.actual_arrows==null?"":String(row.actual_arrows),
    startingBoard:row.starting_board||"",
    breakpointBoard:row.breakpoint_board||"",
    targetArrows:row.target_arrows||"",
    result:row.result||"",
    otherLeave:row.other_leave||[],
    spareMade:row.spare_made||"",
    strikeDescription:row.strike_description||"",
    release:row.release||"",
    miss:row.miss||[],
    ballChangeReason:row.ball_change_reason||[],
    pinCount:row.pin_count||"",
    notes:row.notes||"",
    _displayResult:row.display_result||row.result||"",
    _displayLeave:row.display_leave||row.other_leave||[],
  };
}

export function sessionToSupabaseRow(session,userId,leagueIdsMap){
  const validTeamId=(typeof session.teamId==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.teamId))?session.teamId:null;
  return{
    id:session.id,
    user_id:userId,
    team_id:validTeamId,
    league_id:leagueIdsMap[session.league]||null,
    bowler_name:session.bowler||"",
    date:session.date,
    scores:session.scores||[],
    // The night's own note. Shot notes ride on shots; this one is about
    // the session, so it belongs on the session row rather than being
    // smuggled onto whichever delivery happened to be saved last.
    notes:session.notes||null,
    total:session.total??null,
    average:session.average??null,
    shot_count:session.shotCount||0,
    strikes:session.strikes||0,
    weak_tens:session.weakTens||0,
    ringing_tens:session.ringingTens||0,
    ten_pin_leaves:session.tenPinLeaves||0,
    single_pin_leaves:session.singlePinLeaves||0,
    single_pin_spares:session.singlePinSpares||0,
    spare_attempts:session.spareAttempts||0,
    spares_made:session.sparesMade||0,
    splits:session.splits||0,
    splits_converted:session.splitsConverted||0,
    balls_used:session.ballsUsed||[],
    misses:session.misses||[],
    releases:session.releases||[],
    poker_quarter:session.pokerQuarter||[0,0,0],
    poker_dollar:session.pokerDollar||[0,0,0],
    three_six_nine_winnings:session.threeSixNineWinnings||0,
    jackpot_winnings:session.jackpotWinnings||0,
    high_game_winnings:session.highGameWinnings||[0,0,0],
    poker_quarter_cost:session.pokerQuarterCost||[0,0,0],
    poker_dollar_cost:session.pokerDollarCost||[0,0,0],
    high_game_cost:session.highGameCost||[0,0,0],
    three_six_nine_cost:session.threeSixNineCost||0,
  };
}

export function sessionFromSupabaseRow(row,leagueNameById){
  return{
    id:row.id,
    bowler:row.bowler_name||"",
    teamId:row.team_id||"",
    league:leagueNameById[row.league_id]||"",
    date:row.date,
    scores:row.scores||[],
    notes:row.notes||"",
    total:row.total,
    average:row.average,
    shotCount:row.shot_count||0,
    strikes:row.strikes||0,
    weakTens:row.weak_tens||0,
    ringingTens:row.ringing_tens||0,
    tenPinLeaves:row.ten_pin_leaves||0,
    singlePinLeaves:row.single_pin_leaves||0,
    singlePinSpares:row.single_pin_spares||0,
    spareAttempts:row.spare_attempts||0,
    sparesMade:row.spares_made||0,
    splits:row.splits||0,
    splitsConverted:row.splits_converted||0,
    ballsUsed:row.balls_used||[],
    misses:row.misses||[],
    releases:row.releases||[],
    pokerQuarter:row.poker_quarter||[0,0,0],
    pokerDollar:row.poker_dollar||[0,0,0],
    threeSixNineWinnings:row.three_six_nine_winnings||0,
    jackpotWinnings:row.jackpot_winnings||0,
    highGameWinnings:row.high_game_winnings||[0,0,0],
    pokerQuarterCost:row.poker_quarter_cost||[0,0,0],
    pokerDollarCost:row.poker_dollar_cost||[0,0,0],
    highGameCost:row.high_game_cost||[0,0,0],
    threeSixNineCost:row.three_six_nine_cost||0,
  };
}

const UUID_PATTERN=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// match.teamId can legitimately be a league NAME string, not a real team
// id — the local matchKey fallback (form.teamId||sessionLeague) exists so
// opponent/handicap tracking still works before a bowler is set up as a
// team member, and that fallback value flows straight into this field.
// Never let a non-UUID value reach a uuid column.
export function matchToSupabaseRow(match,leagueIdsMap){
  const validTeamId=(typeof match.teamId==="string"&&UUID_PATTERN.test(match.teamId))?match.teamId:null;
  return{
    id:match.id,
    team_id:validTeamId,
    league_id:leagueIdsMap[match.league]||null,
    date:match.date,
    games:match.games||[null,null,null],
    series:match.series??null,
    opponent:match.opponent||"",
    handicap:match.handicap||"",
  };
}

export function matchFromSupabaseRow(row,leagueNameById){
  return{
    id:row.id,
    teamId:row.team_id||"",
    league:leagueNameById[row.league_id]||"",
    date:row.date,
    games:row.games||[null,null,null],
    series:row.series,
    opponent:row.opponent||"",
    handicap:row.handicap||"",
  };
}

// pattern.teamId can legitimately be a league NAME string, not a real team
// id — same reasoning as matchToSupabaseRow, via the same
// form.teamId||sessionLeague fallback used throughout Lane Conditions.
export function lanePatternToSupabaseRow(pattern,leagueIdsMap){
  const validTeamId=(typeof pattern.teamId==="string"&&UUID_PATTERN.test(pattern.teamId))?pattern.teamId:null;
  return{
    id:pattern.id,
    team_id:validTeamId,
    league_id:leagueIdsMap[pattern.league]||null,
    date:pattern.date,
    lane:String(pattern.lane),
    pattern_type:pattern.patternType||"house",
    pattern_name:pattern.patternName||"",
    length:pattern.length||"",
    volume:pattern.volume||"",
    ratio:pattern.ratio||"",
    // What the bowler wrote down after bowling on it. The reason to keep
    // this next to the score rather than in a phone notes app: "played
    // 4th arrow, ball rolled out" is only useful when it sits beside the
    // 172 it explains.
    notes:pattern.notes||null,
  };
}

export function lanePatternFromSupabaseRow(row,leagueNameById){
  return{
    id:row.id,
    teamId:row.team_id||"",
    league:leagueNameById[row.league_id]||"",
    date:row.date,
    lane:row.lane,
    patternType:row.pattern_type||"house",
    patternName:row.pattern_name||"",
    length:row.length||"",
    volume:row.volume||"",
    ratio:row.ratio||"",
    notes:row.notes||"",
  };
}

// Archived season ranges.
//
// The season a night belongs to is worked out from these date ranges
// rather than stored on the night itself, so closing a season works
// retroactively and cannot drift out of step with thousands of rows.
export function closedSeasonToRow(season, userId) {
  if (!season || typeof season !== "object") return null;
  return {
    id: season.id,
    user_id: userId || null,
    league: season.league,
    start_date: season.startDate,
    end_date: season.endDate,
    closed_at: season.closedAt || new Date().toISOString(),
  };
}

export function closedSeasonFromRow(row) {
  if (!row || typeof row !== "object") return null;
  return {
    id: row.id,
    league: row.league || "",
    startDate: row.start_date || "",
    endDate: row.end_date || "",
    closedAt: row.closed_at || "",
  };
}
