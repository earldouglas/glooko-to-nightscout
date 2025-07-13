{
  pkgs,
  glookoEmail, glookoPassword,
  nightscoutHost, nightscoutApiSecret, 
  ...
}:

let

  glooko-to-nightscout =
    pkgs.fetchFromGitHub {
      owner = "earldouglas";
      repo = "glooko-to-nightscout";
      rev = "3e6d2b0";
      hash = "sha256-d6lopnCc6CiBuu4c6pSoOz7x7qB7pvV5TumBoE8VUU4=";
    };

in {

  systemd.timers."glooko-to-nightscout" = {
    wantedBy = [ "timers.target" ];
    timerConfig = {
      OnCalendar = "hourly";
      Persistent = true;
    };
  };

  systemd.services."glooko-to-nightscout" = {
    script = ''
      set -eu
      ${pkgs.nodejs}/bin/node ${glooko-to-nightscout}/src/index.js
    '';
    serviceConfig = {
      Type = "oneshot";
      User = "root";
    };
    environment = {
      GLOOKO_EMAIL = glookoEmail;
      GLOOKO_PASSWORD = glookoPassword;
      NIGHTSCOUT_HOST = nightscoutHost;
      NIGHTSCOUT_API_SECRET = nightscoutApiSecret;
    };
  };

}
